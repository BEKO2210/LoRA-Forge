
import React, { useState } from 'react';
import type { TrainingConfig } from '../types';
import { generateConfigWithGemini } from '../services/geminiService';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { CgSpinner } from 'react-icons/cg';

interface ConfiguratorProps {
    config: TrainingConfig;
    setConfig: React.Dispatch<React.SetStateAction<TrainingConfig>>;
    isTraining: boolean;
}

export function Configurator({ config, setConfig, isTraining }: ConfiguratorProps) {
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
        }));
    };

    const handleGenerateConfig = async () => {
        if (!aiPrompt) {
            setError('Please enter a description for the AI assistant.');
            return;
        }
        setIsGenerating(true);
        setError(null);
        try {
            const newConfig = await generateConfigWithGemini(aiPrompt);
            setConfig(newConfig);
        } catch (err) {
            console.error(err);
            setError('Failed to generate config. Check the console for details.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-700/50 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-purple-300">Training Configuration</h2>
            
            <div className="space-y-4 mb-6">
                <h3 className="text-md font-medium text-gray-300 border-b border-gray-600 pb-2">AI Assistant</h3>
                <p className="text-sm text-gray-400">Describe your goal, and the AI will suggest a configuration.</p>
                <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., 'Fine-tune a model to write python code snippets'"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                    rows={3}
                    disabled={isTraining || isGenerating}
                />
                <button
                    onClick={handleGenerateConfig}
                    disabled={isTraining || isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isGenerating ? <CgSpinner className="animate-spin text-xl" /> : <FaWandMagicSparkles />}
                    <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <h3 className="text-md font-medium text-gray-300 border-b border-gray-600 pb-2 mb-4">Manual Settings</h3>
            <fieldset disabled={isTraining} className="space-y-4 overflow-y-auto pr-2">
                <ConfigInput label="Model" name="model" value={config.model} onChange={handleChange} />
                <ConfigInput label="Dataset" name="dataset" value={config.dataset} onChange={handleChange} />
                <ConfigInput label="Epochs" name="epochs" type="number" value={config.epochs} onChange={handleChange} min={1} />
                <ConfigInput label="Learning Rate" name="learningRate" type="number" value={config.learningRate} onChange={handleChange} step={0.00001} />
                <ConfigInput label="LoRA Rank (r)" name="loraRank" type="number" value={config.loraRank} onChange={handleChange} min={1} />
                <ConfigInput label="Max Sequence Length" name="maxSeqLength" type="number" value={config.maxSeqLength} onChange={handleChange} min={256} />
                <div className="flex items-center justify-between">
                    <label htmlFor="use4bit" className="text-sm font-medium text-gray-300">Use 4-bit Quantization</label>
                    <input
                        id="use4bit"
                        name="use4bit"
                        type="checkbox"
                        checked={config.use4bit}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-600 focus:ring-purple-500"
                    />
                </div>
            </fieldset>
        </div>
    );
}

interface ConfigInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

function ConfigInput({ label, ...props }: ConfigInputProps) {
    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <input
                id={props.name}
                {...props}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            />
        </div>
    );
}
