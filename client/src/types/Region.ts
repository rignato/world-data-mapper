import { Error, StatusResult, IntResult } from './Utils';

export type Region = {
    _id: string;
    name: string;
    capital: string;
    leader: string;
    landmarks: string[];
    displayPath: string[];
    path: string[];
    createdAt: Date;
};

export type RegionView = {
    _id: string;
    name: string;
    capital: string;
    leader: string;
    landmarks: string[];
    displayPath: string[];
    path: string[];
    createdAt: Date;
    subregionCount: number;
    previousSibling: string;
    nextSibling: string;
    potentialParentNames: string[];
    potentialParentIds: string[];
};

export type RegionPath = {
    _id: string;
    name: string;
    path: string[];
    displayPath: string[];
};

export type RegionResult = Region | Error;

export type RegionViewResult = RegionView | Error;

export type RegionPathResult = RegionPath | Error;

export type Regions = {
    error: string;
    regions: Region[];
    totalPageCount: number;
    displayPath: string[];
    path: string[];
};

export type Landmark = {
    name: string;
    owner: string;
};

export type Landmarks = {
    landmarks: Landmark[];
    error: string;
    totalPageCount: number;
}

export type IGetRegions = {
    getRegions: Regions;
};

export type IGetRegionById = {
    getRegionById: RegionViewResult;
};

export type IGetRegionPath = {
    getRegionPath: RegionPathResult;
};

export type IAddRegion = {
    addRegion: RegionResult;
};

export type IDeleteRegion = {
    deleteRegion: StatusResult;
};

export type IEditRegion = {
    editRegion: StatusResult;
};

export type IChangeParent = {
    changeParent: StatusResult;
};

export type IAddLandmark = {
    addLandmark: StatusResult;
};

export type IGetLandmarks = {
    getLandmarks: Landmarks;
};