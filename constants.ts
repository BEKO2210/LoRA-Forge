
import type { TrainingConfig } from './types';

export const DEFAULT_CONFIG: TrainingConfig = {
    model: 'unsloth/llama-3-8b-Instruct-bnb-4bit',
    dataset: 'yahma/alpaca-cleaned',
    epochs: 3,
    learningRate: 0.0002,
    loraRank: 16,
    use4bit: true,
    maxSeqLength: 2048,
};
