
import React, { useRef, useEffect } from 'react';
import type { LogEntry, LogLevel } from '../types';
import { VscTerminal } from 'react-icons/vsc';

interface LogViewerProps {
    logs: LogEntry[];
}

const levelColors: Record<LogLevel, string> = {
    INFO: 'text-gray-400',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-400',
    SYSTEM: 'text-cyan-400',
};

export function LogViewer({ logs }: LogViewerProps) {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-gray-800/60 rounded-lg border border-gray-700/50 flex flex-col flex-grow overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-gray-700/50">
                <VscTerminal className="text-gray-400" />
                <h3 className="font-semibold text-gray-300">Live Log</h3>
            </div>
            <div ref={logContainerRef} className="p-4 overflow-y-auto flex-grow log-entry text-xs">
                {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Logs will appear here when training starts.</p>
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className="flex gap-4">
                            <span className="text-gray-500">{log.timestamp}</span>
                            <span className={`${levelColors[log.level]} font-medium w-12`}>{log.level}</span>
                            <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
