import { Error, StatusResult } from './Utils';

export type Map = {
    _id: string;
    name: string;
};

export type MapResult = Map | Error;

export type Maps = {
    error: string;
    maps: Map[];
};

export type IGetAllMaps = {
    getAllMaps: Maps;
};

export type IAddMap = {
    addMap: StatusResult;
};

export type IDeleteMap = {
    deleteMap: StatusResult;
};

export type IRenameMap = {
    renameMap: StatusResult;
};