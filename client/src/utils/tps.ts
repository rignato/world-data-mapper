import { useState } from 'react';

export type Transaction = {
    redo: () => Promise<any>,
    undo: () => Promise<any>,
};

const undos: Transaction[] = [];
const redos: Transaction[] = [];

export const useTPS = () => {

    const [hasUndo, setHasUndo] = useState(false);
    const [hasRedo, setHasRedo] = useState(false);

    const checkHasUndo = () => {
        return undos.length > 0;
    };

    const checkHasRedo = () => {
        return redos.length > 0;
    };

    const undo = async () => {
        const transaction = undos.pop();
        if (!transaction)
            return;
        const ret = await transaction.undo();
        redos.push(transaction);
        setHasUndo(checkHasUndo());
        setHasRedo(checkHasRedo());
        return ret;
    };

    const redo = async () => {
        const transaction = redos.pop();
        if (!transaction)
            return;
        const ret = await transaction.redo();
        undos.push(transaction);
        setHasUndo(checkHasUndo());
        setHasRedo(checkHasRedo());
        return ret;
    };

    const add = async (t: Transaction) => {
        if (checkHasRedo())
            redos.splice(0);
        undos.push(t);
        const ret = await t.redo();
        setHasUndo(checkHasUndo());
        setHasRedo(checkHasRedo());
        return ret;
    };

    const clear = () => {
        undos.splice(0);
        redos.splice(0);
    };

    return {
        hasUndo: hasUndo,
        hasRedo: hasRedo,
        tpsUndo: undo,
        tpsRedo: redo,
        tpsAdd: add,
        tpsClear: clear
    };
};
