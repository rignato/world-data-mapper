import { Error, StatusResult, IntResult } from './Utils';

export type Region = {
    _id: string;
    name: string;
    capital: string;
    leader: string;
    landmarks: string[];
    displayPath: string[];
    path: string[];
    subregionCount?: number;
};

export type RegionResult = Region | Error;

export type Regions = {
    error: string;
    regions: Region[];
    totalPageCount: number;
    displayPath: string[];
};

export type IGetRegions = {
    getRegions: Regions;
};

export type IGetRegionById = {
    getRegionById: RegionResult;
};

export type IAddRegion = {
    addRegion: RegionResult;
};

export type IDeleteRegion = {
    deleteRegion: StatusResult;
};

