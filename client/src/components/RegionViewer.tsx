import { faAngleDown, faPlus, faRedoAlt, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt as farTrashAlt, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

import unknownFlag from '../media/unknown_flag.jpg';
import { IGetRegionById, RegionView } from "../types/Region";
import { useQuery } from "@apollo/client";
import { GET_REGION_BY_ID } from "../gql/regionQueries";
import { Link, useLocation, useParams } from "react-router-dom";
import { truncateString } from "../utils/utils";
import { useTPS } from "../utils/tps";
import Loader from "react-loader-spinner";

type Params = {
    mapId: string;
};

const RegionViewer = () => {

    const routeParams = useParams<Params>();

    let location = useLocation();

    const searchParams = new URLSearchParams(location.search);

    const [regionId, setregionId] = useState<string | null>(
        searchParams.get("subregion") ? searchParams.get("subregion") : null
    );

    const [sortedBy, setSortedBy] = useState<string | undefined>(
        searchParams.get("sortedBy") ? searchParams.get("sortedBy")! : undefined
    );

    const [reversed, setReversed] = useState(Boolean(searchParams.get("reversed")));

    const { data: regionData, loading: regionLoading, refetch: refetchRegionData } = useQuery<IGetRegionById>(GET_REGION_BY_ID, {
        variables: { _id: regionId, sortedBy: sortedBy, reversed: reversed },
        skip: !regionId
    });

    const [editingParent, setEditingParent] = useState(false);

    useEffect(() => {
        if (regionId)
            (async () => {
                await refetchRegionData();
            })()
    }, [regionId, refetchRegionData]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const newregionId = searchParams.get("subregion") ? searchParams.get("subregion") : routeParams.mapId;
        setregionId(newregionId);
    }, [location, routeParams.mapId]);

    const { tpsAdd, tpsClear, tpsUndo, hasUndo, tpsRedo, hasRedo } = useTPS();

    const [loadingStart, setLoadingStart] = useState(regionLoading);
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [loadingEnd, setLoadingEnd] = useState(false);

    useEffect(() => {
        if (!regionLoading) {
            setLoadingStart(false);
            setFadeOut(true);
        }
    }, [regionLoading]);

    useEffect(() => {
        if (fadeOut) {
            setTimeout(() => {
                setFadeOut(false);
                setLoadingEnd(true);
                setFadeIn(true);
            }, 250);
        }
    }, [fadeOut]);

    useEffect(() => {
        if (fadeIn) {
            setTimeout(() => {
                setFadeIn(false);
            }, 250);
        }
    }, [fadeIn]);

    return (
        (regionLoading || loadingStart) && !loadingEnd ?
            <div className="container has-text-centered" >
                <Loader color="#FFF" type="ThreeDots" />
            </div>
            : (fadeOut || !loadingEnd) ?
                <div className="container has-text-centered fade-out" >
                    <Loader color="#FFF" type="ThreeDots" />
                </div>
                :
                (<div className="fade-in">
                    {
                        regionData && regionData.getRegionById && "name" in regionData.getRegionById &&
                        <div className={`level mt-0 mb-5`}>
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
                        </div>
                    }

                    <div className="columns">

                        {
                            regionData && regionData.getRegionById && "name" in regionData.getRegionById &&

                            <div className="column">
                                <div className="card ">
                                    <div className="card-image">
                                        <figure className="image is-4by3">
                                            <img src={unknownFlag} alt="Placeholder image" />
                                        </figure>
                                    </div>
                                    <div className="card-content">
                                        <div className="level">
                                            <div className="level-left">
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold">Region name:</p>
                                                </div>
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold">{regionData.getRegionById.name}</p>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="level">
                                            <div className="level-left">
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold">Region parent:</p>
                                                </div>
                                                <div className="level-item">
                                                    <div className="buttons">
                                                        {
                                                            editingParent
                                                                ?
                                                                <div className="dropdown is-active">
                                                                    <div className="dropdown-trigger">
                                                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                                                            <span>Choose parent</span>
                                                                            <span className="icon is-small">
                                                                                <FontAwesomeIcon icon={faAngleDown} />
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                                                        <div className="dropdown-content is-scrollable">
                                                                            {regionData.getRegionById.potentialParentNames.map((item) => (
                                                                                <a href='#' className="dropdown-item" onClick={() => setEditingParent(false)}>{item}</a>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                                :
                                                                <Link to={{
                                                                    pathname: `/maps/${regionData.getRegionById.path[0]}`,
                                                                    search: `${regionData.getRegionById.displayPath.length === 1 ? "" :
                                                                        `subregion=${regionData.getRegionById.path[regionData.getRegionById.displayPath.length - 1]}`
                                                                        }`
                                                                }}>
                                                                    <button className="button is-ghost has-text-info is-size-5 name-input has-text-weight-semibold">
                                                                        {truncateString(regionData.getRegionById.displayPath[regionData.getRegionById.displayPath.length - 1], 25)}
                                                                    </button>
                                                                </Link>
                                                        }

                                                        <button className="button is-small is-light is-info has-text-info" disabled={false} onClick={() => setEditingParent(true)}>
                                                            <span
                                                                className={`icon click-icon ${false ? "has-text-grey-lighter" : "has-text-info"}`}
                                                            >
                                                                <FontAwesomeIcon icon={farEdit} size="lg" />
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="level">
                                            <div className="level-left">
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold">Region capital:</p>
                                                </div>
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold">{regionData.getRegionById.capital}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="level">
                                            <div className="level-left">
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold">Region leader:</p>
                                                </div>
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold">{regionData.getRegionById.leader}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="level">
                                            <div className="level-left">
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold"># of subregions:</p>
                                                </div>
                                                <div className="level-item">
                                                    <p className="subtitle is-5 has-text-dark has-text-weight-semibold">{regionData.getRegionById.subregionCount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        }
                        {
                            regionData && regionData.getRegionById && "name" in regionData.getRegionById &&
                            <div className="column">
                                <div className={`card has-text-centered`} >

                                    <nav className="panel">
                                        <p className="panel-heading">
                                            <span className="is-size-4">Region landmarks</span>

                                        </p>
                                        <div className="container map-select-container">

                                        </div>
                                        <div className="panel-block">

                                            <Pagination pageCount={1} currentPage={1} onPageChange={() => { }} />
                                            <div className="field is-centered has-addons has-addons-centered">
                                                <div className="control">
                                                    <input
                                                        className="input is-medium"
                                                        type="text"
                                                        placeholder="Enter landmark name"
                                                    />
                                                </div>
                                                <div className="control">
                                                    <button className="button is-info is-medium">
                                                        <span className="icon-text level">
                                                            <span className="icon level-item">
                                                                <FontAwesomeIcon icon={faPlus} size="sm" />
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>


                                        </div>

                                    </nav>

                                </div>
                            </div>
                        }


                    </div>

                </div>)
    );
};

export default RegionViewer;