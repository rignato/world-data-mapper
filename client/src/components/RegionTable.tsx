import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltDown, faLongArrowAltUp, faUndoAlt, faRedoAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

import { faPlusSquare as farPlusSquare } from '@fortawesome/free-regular-svg-icons';

import Pagination from './Pagination';
import RegionTableItem from './RegionTableItem';
import { useMutation, useQuery } from '@apollo/client';
import { GET_REGIONS } from '../gql/regionQueries';
import React, { useEffect, useState } from 'react';
import { IAddRegion, IAddRegions, IDeleteRegion, IGetRegions, Region, RegionResult } from '../types/Region';
import { useHistory, useLocation, useParams } from 'react-router';
import { ADD_REGION, ADD_REGIONS, DELETE_REGION } from '../gql/regionMutations';
import Loader from 'react-loader-spinner';
import { TPS } from '../utils/tps';
import { gqlSanitizeInput } from '../utils/utils';


type Params = {
    mapId: string;
}

type Props = {
    tps: TPS;
    setPath: React.Dispatch<React.SetStateAction<string[]>>;
    setDisplayPath: React.Dispatch<React.SetStateAction<string[]>>;
    displayPath: string[];
}

const RegionTable = ({ tps, setPath, setDisplayPath, displayPath }: Props) => {

    const routeParams = useParams<Params>();

    let location = useLocation();
    let history = useHistory();

    const searchParams = new URLSearchParams(location.search);

    const [parentId, setParentId] = useState(
        searchParams.get("subregion") ? searchParams.get("subregion") : routeParams.mapId
    );

    useEffect(() => {
        console.log(location)
        const searchParams = new URLSearchParams(location.search);
        setParentId(searchParams.get("subregion") ? searchParams.get("subregion") : routeParams.mapId)
    }, [location, routeParams.mapId]);

    const perPage = 10;

    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<'name' | 'leader' | 'capital' | undefined>(undefined);
    const [reversed, setReversed] = useState(false);

    const { data: regionData, loading: regionLoading, error: errorLoading, refetch: refetchRegions } = useQuery<IGetRegions>(GET_REGIONS, {
        variables: {
            parentId: parentId,
            perPage: perPage,
            page: page,
            sortBy: sortBy,
            reversed: reversed
        }
    });

    const [name, setName] = useState(regionData ? regionData.getRegions.displayPath[regionData.getRegions.displayPath.length - 1] : '');

    useEffect(() => {
        if (!regionLoading && regionData)
            setName(regionData.getRegions.displayPath[regionData.getRegions.displayPath.length - 1])
    }, [regionData, regionLoading, parentId]);

    useEffect(() => {
        (async () => {
            await refetchRegions();
            if (regionData && !regionData.getRegions.error) {
                setDisplayPath(regionData.getRegions.displayPath);
                setPath(regionData.getRegions.path);
            } else {
                setPath([]);
                setDisplayPath([]);
            }
        })()
    }, [page, reversed, sortBy, refetchRegions, parentId, location, regionData, setDisplayPath, setPath]);

    useEffect(() => {
        if (regionData && regionData.getRegions.regions.length === 0 && page > 1) {
            setPage(page - 1);
        }
    }, [regionData, page]);

    const [addRegion] = useMutation<IAddRegion>(ADD_REGION);
    const [addRegions] = useMutation<IAddRegions>(ADD_REGIONS);
    const [deleteRegion] = useMutation<IDeleteRegion>(DELETE_REGION);

    const { tpsAdd, tpsClear, tpsUndo, hasUndo, tpsRedo, hasRedo } = tps;

    const handlePageChange = async (newPage: number) => {
        setPage(newPage);
    }

    const [regionToDelete, setRegionToDelete] = useState<Region | undefined>();

    const handleAddRegion = async () => {

        let region: Region | undefined = undefined;

        await tpsAdd({
            redo: async () => {
                const { data } = await addRegion({ variables: { parentId: parentId, region: gqlSanitizeInput(region) } });
                if (!data) {
                    console.error("Unknown error occurred.");
                    return;
                }

                const regionRes = data.addRegion;

                if ("error" in regionRes)
                    console.error(regionRes.error)
                else {
                    region = regionRes;
                    await refetchRegions();
                }
            },
            undo: async () => {
                if (!region) {
                    console.error("Cannot undo addRegion: no region found.");
                    return;
                }
                const { data } = await deleteRegion({ variables: { _id: region._id } });
                if (!data) {
                    console.error("Unknown error occurred.");
                    return;
                }

                const deleteRes = data.deleteRegion;

                if (deleteRes.error)
                    console.error(deleteRes.error);
                else {
                    await refetchRegions();
                }
            }
        });
    };

    const handleConfirmDeleteRegion = async (region: Region) => {
        if (!region)
            return;
        let regions: Region[] = [];
        await tpsAdd({
            redo: async () => {
                const { data } = await deleteRegion({ variables: { _id: region._id } });
                if (!data) {
                    console.error("Unknown error occurred.");
                    return;
                }

                const deleteRes = data.deleteRegion;

                if (deleteRes.error)
                    console.error(deleteRes.error);
                else {
                    regions = deleteRes.regions.map((region) => gqlSanitizeInput(region));
                    await refetchRegions();
                }
            },
            undo: async () => {
                console.log(region);
                const { data } = await addRegions({ variables: { parentId: parentId, regions: regions } });
                if (!data) {
                    console.error("Unknown error occurred.");
                    return;
                }

                const regionRes = data.addRegions;

                if (regionRes.error)
                    console.error(regionRes.error)
                else {
                    await refetchRegions();
                }
            }
        });
        setRegionToDelete(undefined);
    };

    const handleDeleteRegion = (region: Region) => {
        setRegionToDelete(region);
    };

    const handleSortRegion = async (key: 'name' | 'capital' | 'leader') => {
        const prevKey = sortBy;
        const prevReversed = reversed;
        await tpsAdd({
            redo: async () => {
                setReversed(sortBy === key && !reversed ? true : false);
                setSortBy(key);
                setPage(1);
            },
            undo: async () => {
                setSortBy(prevKey);
                setReversed(prevReversed);
                setPage(1);
            }
        });
    };

    return (
        <div className="container" >
            {
                regionToDelete &&
                <div className={`modal ${regionToDelete && "is-active"}`}>
                    <div className="modal-background" />
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Confirm subregion deletion</p>
                            <button className="delete" aria-label="close" onClick={() => setRegionToDelete(undefined)} />
                        </header>
                        <section className="modal-card-body has-text-dark">
                            Are you sure you want to delete the subregion "{regionToDelete.name}"?
                    </section>
                        <footer className="modal-card-foot">
                            <button className="button is-danger" onClick={() => handleConfirmDeleteRegion(regionToDelete)}>Yes, delete</button>
                            <button className="button" onClick={() => setRegionToDelete(undefined)}>No, cancel</button>
                        </footer>
                    </div>
                </div>
            }


            <div className={`level mt-0 mb-${searchParams.get("subregion") ? "0" : "5"}`}>
                <div className="level-left">
                    <div className="level-item buttons">
                        <button className="button is-dark" disabled={!hasUndo} onClick={tpsUndo}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faUndoAlt} size="lg" />
                            </span>
                        </button>
                        <button className="button is-dark" disabled={!hasRedo} onClick={tpsRedo}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faRedoAlt} size="lg" />
                            </span>
                        </button>

                    </div>

                </div>

                <div className="level-item block has-text-centered">
                    <div className="title has-text-weight-medium">Region name: </div>
                    {
                        searchParams.get("subregion") ?
                            <button className={`title has-text-weight-medium button has-text-info is-ghost`} onClick={() => {
                                history.push({
                                    pathname: `${location.pathname}/view`,
                                    search: `subregion=${searchParams.get("subregion")}${sortBy ? `&sortBy=${sortBy}` : ""}&reversed=${reversed}`
                                })
                            }}>{
                                    name
                                }
                            </button>
                            :
                            <div className={`title has-text-weight-medium pl-5`}>{
                                name
                            }
                            </div>
                    }

                </div>
            </div>


            <table className="table is-fullwidth is-hoverable is-rounded mb-0">
                <thead >
                    <tr className="has-background-info">
                        <th className="table-col">
                            <button
                                className={
                                    `${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button icon-text is-ghost has-text-light has-text-weight-semibold is-size-5`
                                }
                                onClick={async () => { await handleSortRegion('name') }}>
                                <span>Name</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} className={`has-text-info-${reversed && sortBy === 'name' ? "light" : "dark"}`} />
                                    <FontAwesomeIcon icon={faLongArrowAltDown} className={`has-text-info-${!reversed && sortBy === 'name' ? "light" : "dark"}`} />
                                </span>
                            </button>

                        </th>
                        <th className="table-col px-0">
                            <button
                                className={
                                    `${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button icon-text is-ghost has-text-light has-text-weight-semibold is-size-5`
                                }
                                onClick={async () => { await handleSortRegion('capital') }}>
                                <span>Capital</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} className={`has-text-info-${reversed && sortBy === 'capital' ? "light" : "dark"}`} />
                                    <FontAwesomeIcon icon={faLongArrowAltDown} className={`has-text-info-${!reversed && sortBy === 'capital' ? "light" : "dark"}`} />
                                </span>
                            </button>

                        </th>
                        <th className="table-col px-0">
                            <button
                                className={
                                    `${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button icon-text is-ghost has-text-light has-text-weight-semibold is-size-5`
                                }
                                onClick={async () => { await handleSortRegion('leader') }}>
                                <span>Leader</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} className={`has-text-info-${reversed && sortBy === 'leader' ? "light" : "dark"}`} />
                                    <FontAwesomeIcon icon={faLongArrowAltDown} className={`has-text-info-${!reversed && sortBy === 'leader' ? "light" : "dark"}`} />
                                </span>
                            </button>
                        </th>
                        <th className="">
                            <div className={`mt-0 py-2 ${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} has-text-light has-text-weight-semibold is-size-5`}>Flag</div>
                        </th>
                        <th className="px-5 table-col">
                            <div className={`mt-0 py-2 ${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} has-text-light has-text-weight-semibold is-size-5`}>Landmarks</div>

                        </th>
                        <th>
                            <button className={`${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button is-primary is-light my-2 px-3 is-small`} onClick={handleAddRegion}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faPlus} size="2x" />
                                </span>
                            </button>

                        </th>
                    </tr>
                </thead>
                <tbody>

                    {
                        regionLoading || !regionData || !regionData.getRegions || false
                            ?
                            <tr>
                                <td></td>
                                <td></td>
                                <div className="is-fullwidth pt-6 mt-5 table-body-container">
                                    <Loader color="hsl(0, 0%, 86%)" type="TailSpin" />
                                </div>
                            </tr>
                            :
                            Object.assign(new Array(perPage).fill(null), regionData?.getRegions.regions).map((region, index) => (
                                region
                                    ?
                                    <RegionTableItem
                                        key={region._id}
                                        mapId={routeParams.mapId}
                                        region={region}
                                        handleDelete={handleDeleteRegion}
                                        refetch={refetchRegions}
                                        tps={tps}
                                        sortBy={sortBy}
                                        reversed={reversed}
                                        displayPath={displayPath}
                                    />
                                    :
                                    <RegionTableItem
                                        key={`empty_${index}`}
                                        empty
                                        handleDelete={handleDeleteRegion}
                                        refetch={refetchRegions}
                                        tps={tps}
                                        sortBy={sortBy}
                                        reversed={reversed}
                                        displayPath={displayPath}
                                    />
                            ))
                    }
                </tbody>


            </table>
            <div className="container has-background-white py-1 px-1">
                <Pagination
                    pageCount={regionData && regionData.getRegions ? regionData.getRegions.totalPageCount : 0}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />

            </div>

        </div>

    );
};

export default RegionTable;