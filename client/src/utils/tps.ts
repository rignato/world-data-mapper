import { createContext, useState } from 'react';

export type Transaction = {
    redo: () => Promise<any>,
    undo: () => Promise<any>,
};

const undos: Transaction[] = [];
const redos: Transaction[] = [];

export const useTPS = () => {



    const [hasUndo, setHasUndo] = useState(false);
    const [hasRedo, setHasRedo] = useState(false);

    const updateState = () => {
        setHasUndo(undos.length > 0);
        setHasRedo(redos.length > 0);
    };

    const undo = async () => {
        const transaction = undos.pop();
        if (!transaction)
            return;
        const ret = await transaction.undo();
        redos.push(transaction);
        updateState();
        return ret;
    };

    const redo = async () => {
        const transaction = redos.pop();
        if (!transaction)
            return;
        const ret = await transaction.redo();
        undos.push(transaction);
        updateState();
        return ret;
    };

    const add = async (t: Transaction) => {
        redos.splice(0);
        undos.push(t);
        const ret = await t.redo();
        updateState();
        return ret;
    };

    const clear = async () => {
        undos.splice(0);
        redos.splice(0);
        updateState();
        console.log(undos, redos, hasUndo, hasRedo)
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

export type TPS = {
    hasUndo: boolean,
    hasRedo: boolean,
    tpsUndo: () => any,
    tpsRedo: () => any,
    tpsAdd: (t: Transaction) => any,
    tpsClear: () => void
};
