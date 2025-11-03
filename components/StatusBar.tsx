
import React from 'react';
import type { TrainingStatus } from '../types';
// fix: Use FaCircleCheck from fa6 instead of FaCheckCircle which is not in this icon set.
import { FaPlay, FaStop, FaCircleCheck } from 'react-icons/fa6';
import { CgSpinner } from 'react-icons/cg';

interface StatusBarProps {
    status: TrainingStatus;
    progress: number;
    onStart: () => void;
    onStop: () => void;
}

const statusInfo = {
    IDLE: { text: 'Idle', color: 'text-gray-400', icon: <FaPlay /> },
    RUNNING: { text: 'Running', color: 'text-blue-400', icon: <CgSpinner className="animate-spin" /> },
    // fix: Use FaCircleCheck icon for completed status to match the import from react-icons/fa6.
    COMPLETED: { text: 'Completed', color: 'text-green-400', icon: <FaCircleCheck /> },
    STOPPED: { text: 'Stopped', color: 'text-yellow-400', icon: <FaPlay /> },
    ERROR: { text: 'Error', color: 'text-red-400', icon: <FaPlay /> },
};

export function StatusBar({ status, progress, onStart, onStop }: StatusBarProps) {
    const { text, color, icon } = statusInfo[status];

    return (
        <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700/50 flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className={`text-xl ${color}`}>{icon}</span>
                <span className={`font-semibold ${color}`}>{text}</span>
            </div>
            <div className="flex-grow bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <span className="text-sm font-mono w-12 text-right">{progress.toFixed(0)}%</span>
            {status === 'RUNNING' ? (
                <button
                    onClick={onStop}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    aria-label="Stop Training"
                >
                    <FaStop />
                    <span>Stop</span>
                </button>
            ) : (
                <button
                    onClick={onStart}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    aria-label="Start Training"
                >
                    <FaPlay />
                    <span>Start</span>
                </button>
            )}
        </div>
    );
}
