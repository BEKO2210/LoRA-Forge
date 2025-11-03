
export interface TrainingConfig {
    model: string;
    dataset: string;
    epochs: number;
    learningRate: number;
    loraRank: number;
    use4bit: boolean;
    maxSeqLength: number;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM';

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
}

export type TrainingStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'STOPPED' | 'ERROR';
