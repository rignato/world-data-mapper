import { Error, StatusResult, IntResult } from './Utils';

export type Region = {
    _id: string;
    name: string;
    capital: string;
    leader: string;
    landmarks: Landmark[];
    displayPath: string[];
    path: string[];
    createdAt: Date;
};

export type RegionView = {
    _id: string;
    name: string;
    capital: string;
    leader: string;
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

export type LandmarkResult = Landmark | Error;

export type Regions = {
    error: string;
    regions: Region[];
    totalPageCount: number;
    displayPath: string[];
    path: string[];
};

export type RegionsLite = {
    error: string;
    regions: Region[];
};

export type Landmark = {
    _id: string;
    name: string;
    owner: string;
    ownerName: string;
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

export type IAddRegions = {
    addRegions: StatusResult;
};

export type IDeleteRegion = {
    deleteRegion: RegionsLite;
};

export type IEditRegion = {
    editRegion: StatusResult;
};

export type IChangeParent = {
    changeParent: StatusResult;
};

export type IAddLandmark = {
    addLandmark: LandmarkResult;
};

export type IGetLandmarks = {
    getLandmarks: Landmarks;
};

export type IDeleteLandmark = {
    deleteLandmark: StatusResult;
};

export type IEditLandmark = {
    editLandmark: StatusResult;
};