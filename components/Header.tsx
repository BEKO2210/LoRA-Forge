
import React from 'react';
import { FaBrain } from 'react-icons/fa6';

export function Header() {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
                <FaBrain className="text-2xl text-purple-400" />
                <h1 className="text-xl font-bold text-gray-100 tracking-wider">
                    Unsloth LoRA Trainer UI
                </h1>
            </div>
        </header>
    );
}
