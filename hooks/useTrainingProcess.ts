
import { useState, useRef, useCallback } from 'react';
import type { TrainingStatus, LogEntry, TrainingConfig } from '../types';

const formatTime = () => new Date().toLocaleTimeString('en-US', { hour12: false });

export function useTrainingProcess() {
    const [status, setStatus] = useState<TrainingStatus>('IDLE');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState(0);

    const intervalRef = useRef<number | null>(null);
    const configRef = useRef<TrainingConfig | null>(null);

    const addLog = (level: LogEntry['level'], message: string) => {
        setLogs(prev => [...prev, { timestamp: formatTime(), level, message }]);
    };

    const stopTraining = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (status === 'RUNNING') {
            setStatus('STOPPED');
            addLog('SYSTEM', 'Training process stopped by user.');
        }
    }, [status]);

    const startTraining = useCallback((config: TrainingConfig) => {
        stopTraining(); // Ensure any previous process is stopped
        configRef.current = config;
        setStatus('RUNNING');
        setLogs([]);
        setProgress(0);

        addLog('SYSTEM', 'Initializing training process...');
        addLog('INFO', `Model: ${config.model}`);
        addLog('INFO', `Dataset: ${config.dataset}`);
        addLog('INFO', `Epochs: ${config.epochs}, LR: ${config.learningRate}, Rank: ${config.loraRank}`);

        let currentEpoch = 1;
        let step = 0;
        const totalSteps = config.epochs * 100; // Mock 100 steps per epoch

        intervalRef.current = window.setInterval(() => {
            step++;
            const currentProgress = (step / totalSteps) * 100;
            setProgress(currentProgress);

            if (step % 100 === 0) {
                addLog('INFO', `Epoch ${currentEpoch}/${config.epochs} completed. Loss: ${(Math.random() / currentEpoch).toFixed(4)}`);
                currentEpoch++;
            } else if (step % 20 === 0) {
                addLog('INFO', `Step ${step % 100}/100 | Loss: ${(Math.random() / (currentEpoch + Math.random())).toFixed(4)}`);
            }

            if (step >= totalSteps) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setProgress(100);
                setStatus('COMPLETED');
                addLog('SYSTEM', 'Training completed successfully.');
            }
        }, 150);
    }, [stopTraining]);

    return { status, logs, progress, startTraining, stopTraining };
}
