/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { faAngleDown, faArrowLeft, faArrowRight, faPlus, faRedoAlt, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt as farTrashAlt, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import React, { SyntheticEvent, useEffect, useState } from "react";
import Pagination from "./Pagination";

import { IAddLandmark, IChangeParent, IDeleteLandmark, IGetRegionById, Landmark, Region, RegionView } from "../types/Region";
import { useMutation, useQuery } from "@apollo/client";
import { GET_LANDMARKS, GET_REGION_BY_ID } from "../gql/regionQueries";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { getFlagURL, gqlSanitizeInput, truncateString, validateName } from "../utils/utils";
import { TPS } from "../utils/tps";
import Loader from "react-loader-spinner";
import { ADD_LANDMARK, CHANGE_PARENT, DELETE_LANDMARK } from "../gql/regionMutations";
import LandmarkItem from "./LandmarkItem";

type Params = {
    mapId: string;
};

type Props = {
    tps: TPS;
    setPath: React.Dispatch<React.SetStateAction<string[]>>;
    setDisplayPath: React.Dispatch<React.SetStateAction<string[]>>;
    displayPath: string[];
}

const RegionViewer = ({ tps, setPath, setDisplayPath, displayPath }: Props) => {

    const routeParams = useParams<Params>();

    let location = useLocation();
    let history = useHistory();

    const searchParams = new URLSearchParams(location.search);

    const [regionId, setregionId] = useState<string | null>(
        searchParams.get("subregion") ? searchParams.get("subregion") : null
    );

    const [sortBy, setsortBy] = useState<string | undefined>(
        searchParams.get("sortBy") ? searchParams.get("sortBy")! : undefined
    );

    const [reversed, setReversed] = useState(searchParams.get("reversed") ? searchParams.get("reversed") === 'true' : false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setsortBy(searchParams.get("sortBy") ? searchParams.get("sortBy")! : undefined);
        setReversed(searchParams.get("reversed") ? searchParams.get("reversed") === 'true' : false)
    }, [location])

    const { data: regionData, loading: regionLoading, refetch: refetchRegionData } = useQuery<IGetRegionById>(GET_REGION_BY_ID, {
        variables: {
            _id: new URLSearchParams(location.search).get("subregion") ? new URLSearchParams(location.search).get("subregion") : null,
            sortBy: new URLSearchParams(location.search).get("sortBy") ? new URLSearchParams(location.search).get("sortBy") : undefined,
            reversed: new URLSearchParams(location.search).get("reversed") ? new URLSearchParams(location.search).get("reversed") === 'true' : false
        },
        skip: !regionId
    });

    const [editingParent, setEditingParent] = useState(false);

    useEffect(() => {
        if (regionId)
            (async () => {
                await refetchRegionData();
                if (regionData && !('error' in regionData.getRegionById)) {
                    setDisplayPath([...regionData.getRegionById.displayPath, regionData.getRegionById.name]);
                    setPath([...regionData.getRegionById.path, regionData.getRegionById._id]);
                } else {
                    setPath([]);
                    setDisplayPath([]);
                }
            })()
    }, [location, regionId, refetchRegionData, regionData, setPath, setDisplayPath]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const newregionId = searchParams.get("subregion") ? searchParams.get("subregion") : routeParams.mapId;
        setregionId(newregionId);
    }, [location, routeParams.mapId]);

    const { tpsAdd, tpsClear, tpsUndo, hasUndo, tpsRedo, hasRedo } = tps;

    const [changeParent] = useMutation<IChangeParent>(CHANGE_PARENT);

    const handleChangeParent = async (newParentId: string) => {
        if (!regionData || 'error' in regionData.getRegionById)
            return;
        const region = regionData.getRegionById;
        const prevParentId = region.path[region.path.length - 1];
        await tpsAdd({
            redo: async () => {
                const { data } = await changeParent({ variables: { _id: regionId, parentId: newParentId } });
                if (!data) {
                    console.error("Unknown error occurred.");
                    return;
                }

                const changeParentRes = data.changeParent;
                if (changeParentRes.error)
                    console.error(changeParentRes.error)
                else {
                    await refetchRegionData();
                }
            },
            undo: async () => {
                const { data } = await changeParent({ variables: { _id: regionId, parentId: prevParentId } });
                if (!data) {
                    console.error("Unknown error occurred.");
                    return;
                }

                const changeParentRes = data.changeParent;
                if (changeParentRes.error)
                    console.error(changeParentRes.error)
                else {
                    await refetchRegionData();
                }
            }
        });
    };

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

    const perPage = 9;
    const [page, setPage] = useState(1);

    const [newLandmarkName, setNewLandmarkName] = useState("");

    const [landmarkToDelete, setLandmarkToDelete] = useState<Landmark | undefined>();

    const [addLandmark] = useMutation<IAddLandmark>(ADD_LANDMARK);
    const [deleteLandmark] = useMutation<IDeleteLandmark>(DELETE_LANDMARK);
    const { data: landmarkData, loading: landmarkLoading, error: landmarkError, refetch: landmarkRefetch } = useQuery(GET_LANDMARKS, {
        variables: {
            _id: regionId,
            page: page,
            perPage: perPage
        },
        skip: !regionId
    });

    useEffect(() => {
        (async () => {

            await landmarkRefetch();
        })()
    }, [page, landmarkRefetch]);


    useEffect(() => {
        console.log(getFlagURL(displayPath));
        console.log(landmarkData);
    }, [landmarkData, displayPath]);

    const handlePageChange = async (newPage: number) => {
        setPage(newPage);
    };

    const handleNewLandmarkNameChange = async (e: React.FormEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        setNewLandmarkName(newValue);
    }

    const handleAddLandmark = async () => {
        const landmark: Landmark = {
            _id: "",
            name: newLandmarkName,
            owner: "",
            ownerName: ""
        };
        await tpsAdd({
            redo: async () => {
                const { data } = await addLandmark({ variables: { _id: regionId, landmark: gqlSanitizeInput(landmark) } });
                setNewLandmarkName("");
                if (!data) {
                    console.error("Unknown error occurred.")
                    return;
                }

                const addStatus = data.addLandmark;

                if ("error" in addStatus)
                    console.error(addStatus.error)
                else {
                    landmark._id = addStatus._id;
                    landmark.owner = addStatus.owner;
                    landmark.ownerName = addStatus.ownerName;
                    await landmarkRefetch();
                }
            },
            undo: async () => {
                if (landmark._id.length === 0) {
                    console.error("Unknown error occurred.")
                    return;
                }
                const { data } = await deleteLandmark({ variables: { regionId: regionId, landmarkId: landmark._id } });
                if (!data) {
                    console.error("Unknown error occurred.")
                    return;
                }

                const deleteStatus = data.deleteLandmark;

                if (deleteStatus.error)
                    console.error(deleteStatus.error)
                else {
                    await landmarkRefetch();
                }
            }
        })
    };

    const handleConfirmDeleteLandmark = async (landmark: Landmark) => {
        await tpsAdd({
            redo: async () => {
                const { data } = await deleteLandmark({ variables: { regionId: regionId, landmarkId: landmark._id } });
                if (!data) {
                    console.error("Unknown error occurred.")
                    return;
                }

                const deleteStatus = data.deleteLandmark;

                if (deleteStatus.error)
                    console.error(deleteStatus.error)
                else {
                    await landmarkRefetch();
                }
            },
            undo: async () => {
                const { data } = await addLandmark({ variables: { _id: regionId, landmark: gqlSanitizeInput(landmark) } });
                if (!data) {
                    console.error("Unknown error occurred.")
                    return;
                }

                const addStatus = data.addLandmark;

                if ("error" in addStatus)
                    console.error(addStatus.error)
                else {
                    await landmarkRefetch();
                }
            }
        });
        setLandmarkToDelete(undefined);
    };

    const handleDeleteLandmark = (landmark: Landmark) => {
        setLandmarkToDelete(landmark);
    };



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
                        landmarkToDelete &&
                        <div className={`modal ${landmarkToDelete && "is-active"}`}>
                            <div className="modal-background" />
                            <div className="modal-card">
                                <header className="modal-card-head">
                                    <p className="modal-card-title">Confirm landmark deletion</p>
                                    <button className="delete" aria-label="close" onClick={() => setLandmarkToDelete(undefined)} />
                                </header>
                                <section className="modal-card-body has-text-dark">
                                    Are you sure you want to delete the landmark "{landmarkToDelete.name}"?
                    </section>
                                <footer className="modal-card-foot">
                                    <button className="button is-danger" onClick={() => handleConfirmDeleteLandmark(landmarkToDelete)}>Yes, delete</button>
                                    <button className="button" onClick={() => setLandmarkToDelete(undefined)}>No, cancel</button>
                                </footer>
                            </div>
                        </div>
                    }
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

                    <div className="columns">

                        {
                            regionData && regionData.getRegionById && !('error' in regionData.getRegionById) &&

                            <div className="column">
                                <div className="card ">
                                    <div className="card-image">
                                        <figure className="image is-4by3">
                                            <img src={getFlagURL(displayPath)} onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = '/flags/unknown_flag.jpg' }} />
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
                                                                        <button className="button mb-0" aria-haspopup="true" aria-controls="dropdown-menu">
                                                                            <span>Choose parent</span>
                                                                            <span className="icon is-small">
                                                                                <FontAwesomeIcon icon={faAngleDown} />
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                                                        <div className="dropdown-content is-scrollable py-0">
                                                                            {
                                                                                regionData && !('error' in regionData.getRegionById) && regionData.getRegionById.potentialParentIds.map((item, index) => (
                                                                                    regionData && !('error' in regionData.getRegionById) && (item === regionData.getRegionById.path[regionData.getRegionById.path.length - 1] ?
                                                                                        <a href='#' className="dropdown-item is-active" onClick={() => setEditingParent(false)}>{regionData && !('error' in regionData.getRegionById) && regionData.getRegionById.potentialParentNames[index]}</a>
                                                                                        :
                                                                                        <a href='#' className="dropdown-item" onClick={async () => {
                                                                                            if (regionData && !('error' in regionData.getRegionById))
                                                                                                await handleChangeParent(regionData.getRegionById.potentialParentIds[index]);
                                                                                            setEditingParent(false);
                                                                                        }}>{regionData && !('error' in regionData.getRegionById) && regionData.getRegionById.potentialParentNames[index]}</a>
                                                                                    )

                                                                                ))
                                                                            }
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
                                                        {
                                                            !editingParent &&
                                                            <button className="button is-small is-light is-info has-text-info" onClick={() => setEditingParent(true)}>
                                                                <span
                                                                    className={`icon click-icon ${false ? "has-text-grey-lighter" : "has-text-info"}`}
                                                                >
                                                                    <FontAwesomeIcon icon={farEdit} size="lg" />
                                                                </span>
                                                            </button>
                                                        }

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
                                            {
                                                landmarkError ? `Error loading maps ${landmarkError}`
                                                    :
                                                    landmarkLoading ?
                                                        <div className="section is-medium">
                                                            <Loader color="hsl(0, 0%, 86%)" type="TailSpin" />
                                                        </div>
                                                        :
                                                        landmarkData && landmarkData.getLandmarks.landmarks.map((landmark: Landmark, index: number) => {
                                                            return (
                                                                <LandmarkItem
                                                                    key={`${landmark.owner}-${landmark.name}-${index}`}
                                                                    landmark={landmark}
                                                                    currentRegionId={regionId}
                                                                    deleteCallback={handleDeleteLandmark}
                                                                    refetch={landmarkRefetch}
                                                                    tps={tps}
                                                                />
                                                            )
                                                        })
                                            }
                                        </div>
                                        <div className="panel-block">

                                            {
                                                landmarkData && landmarkData.getLandmarks &&
                                                <Pagination pageCount={landmarkData.getLandmarks.totalPageCount} currentPage={page} onPageChange={handlePageChange} />
                                            }
                                            <div className="field is-centered has-addons has-addons-centered">
                                                <div className="control">
                                                    <input
                                                        className="input is-medium"
                                                        type="text"
                                                        placeholder="Enter landmark name"
                                                        value={newLandmarkName}
                                                        onChange={handleNewLandmarkNameChange}
                                                    />
                                                </div>
                                                <div className="control">
                                                    <button className="button is-info is-medium" disabled={!validateName(newLandmarkName)} onClick={handleAddLandmark}>
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
                    <div className={`level mt-0 mb-5`}>
                        <div className="level-item">
                            <button className="button is-dark" onClick={() => {
                                console.log(reversed);
                                history.push({
                                    pathname: location.pathname,
                                    search: `subregion=${(regionData!.getRegionById as RegionView).previousSibling}${sortBy ? `&sortBy=${sortBy}` : ''}&reversed=${reversed}`
                                })
                            }}
                                disabled={regionData && 'previousSibling' in regionData.getRegionById ? regionData.getRegionById.previousSibling === null : true}>

                                <span className="icon-text">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                                    </span>
                                    <span>Previous subregion</span>


                                </span>
                            </button>
                        </div>
                        <div className="level-item">
                            <button className="button is-dark" onClick={() => {
                                console.log(reversed);
                                history.push({
                                    pathname: location.pathname,
                                    search: `subregion=${(regionData!.getRegionById as RegionView).nextSibling}${sortBy ? `&sortBy=${sortBy}` : ''}&reversed=${reversed}`
                                })
                            }}
                                disabled={regionData && 'nextSibling' in regionData.getRegionById ? regionData.getRegionById.nextSibling === null : true}>

                                <span className="icon-text">
                                    <span>Next subregion</span>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faArrowRight} size="lg" />
                                    </span>

                                </span>
                            </button>
                        </div>
                    </div>
                </div>)
    );
};

export default RegionViewer;