
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Configurator } from './components/Configurator';
import { LogViewer } from './components/LogViewer';
import { StatusBar } from './components/StatusBar';
import { useTrainingProcess } from './hooks/useTrainingProcess';
import type { TrainingConfig, LogEntry } from './types';
import { DEFAULT_CONFIG } from './constants';

export default function App() {
    const [config, setConfig] = useState<TrainingConfig>(DEFAULT_CONFIG);
    const { status, logs, progress, startTraining, stopTraining } = useTrainingProcess();

    const handleStart = useCallback(() => {
        startTraining(config);
    }, [config, startTraining]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">
            <Header />
            <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
                <aside className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                    <Configurator
                        config={config}
                        setConfig={setConfig}
                        isTraining={status === 'RUNNING'}
                    />
                </aside>
                <div className="flex-grow flex flex-col gap-4 overflow-hidden">
                    <StatusBar
                        status={status}
                        progress={progress}
                        onStart={handleStart}
                        onStop={stopTraining}
                    />
                    <LogViewer logs={logs} />
                </div>
            </main>
        </div>
    );
}
