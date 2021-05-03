import { UserResult } from '../types/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import MapSelectItem from './MapSelectItem';
import { useMutation, useQuery } from '@apollo/client';
import { IAddMap, IDeleteMap, IGetMaps, IRenameMap, Map } from '../types/Map';
import { GET_MAPS } from '../gql/mapQueries';
import { ADD_MAP, DELETE_MAP, RENAME_MAP } from '../gql/mapMutations';
import Loader from 'react-loader-spinner';
import { useEffect, useState } from 'react';
import Pagination from './Pagination';

type Props = {
    user?: UserResult;
    fadeIn?: boolean;
}

const MapSelect = ({ user, fadeIn }: Props) => {

    const perPage = 6;
    const [page, setPage] = useState(1);

    const [newMapName, setNewMapName] = useState("")

    const [mapToDelete, setMapToDelete] = useState({ _id: "", name: "" });

    const { data: mapsData, loading: mapsLoading, error: mapsError, refetch: refetchMaps } = useQuery<IGetMaps>(GET_MAPS, {
        variables: { page: page, perPage: perPage }
    });

    const [addMap] = useMutation<IAddMap>(ADD_MAP);
    const [deleteMap] = useMutation<IDeleteMap>(DELETE_MAP);
    const [renameMap] = useMutation<IRenameMap>(RENAME_MAP);

    useEffect(() => {
        (async () => {
            await refetchMaps();
        })()
    }, [page, refetchMaps]);

    const handlePageChange = async (newPage: number) => {
        setPage(newPage);
    }

    const handleNewMapNameChange = async (e: React.FormEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        setNewMapName(newValue);
    }

    const handleAddMap = async () => {
        const { data } = await addMap({ variables: { name: newMapName } });
        setNewMapName("");
        if (!data) {
            console.error("Unknown error occurred.")
            return;
        }

        const addStatus = data.addMap;

        if (addStatus.error)
            console.error(addStatus.error)
        else {
            await refetchMaps();
        }

    };

    const handleDeleteMap = async (_id: string) => {
        const { data } = await deleteMap({ variables: { _id: _id } });
        setMapToDelete({ _id: "", name: "" });
        if (!data) {
            console.error("Unknown error occurred.")
            return;
        }

        const deleteStatus = data.deleteMap;
        if (deleteStatus.error)
            console.error(deleteStatus.error);
        else {
            if (mapsData && mapsData.getMaps.maps.length === 1 && page > 1)
                setPage(page - 1);
            else {
                await refetchMaps();
            }
        }
    };

    const handleRenameMap = async (_id: string, name: string) => {
        const { data } = await renameMap({ variables: { _id: _id, name: name } });
        if (!data) {
            console.error("Unknown error occurred.")
            return;
        }

        const renameStatus = data.renameMap;
        if (renameStatus.error)
            console.error(renameStatus.error);
        else {
            await refetchMaps();
        }
    }

    const handleDeleteConfirm = (map: Map) => {
        setMapToDelete(map);
    }

    return (
        <div>
            <div className={`modal ${mapToDelete._id.length > 0 && 'is-active'}`}>
                <div className="modal-background" />
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Confirm map deletion</p>
                        <button className="delete" aria-label="close" onClick={() => setMapToDelete({ _id: "", name: "" })} />
                    </header>
                    <section className="modal-card-body has-text-dark">
                        Are you sure you want to delete the map "{mapToDelete.name}"?
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-danger" onClick={() => handleDeleteMap(mapToDelete._id)}>Yes, delete</button>
                        <button className="button" onClick={() => setMapToDelete({ _id: "", name: "" })}>No, cancel</button>
                    </footer>
                </div>
            </div>

            <div className={`card has-text-centered ${fadeIn ? "fade-in" : ""}`} >

                <nav className="panel">
                    <p className="panel-heading">
                        <span className="is-size-4">Maps</span>

                    </p>
                    <div className="container map-select-container">
                        {
                            mapsError ? `Error loading maps ${mapsError}`
                                :
                                mapsLoading ?
                                    <div className="section is-medium">
                                        <Loader color="hsl(0, 0%, 86%)" type="TailSpin" />
                                    </div>
                                    :
                                    mapsData && mapsData.getMaps.maps.map((map) => (
                                        <MapSelectItem
                                            key={map._id}
                                            name={map.name}
                                            _id={map._id}
                                            deleteCallback={handleDeleteConfirm}
                                            renameCallback={handleRenameMap}
                                        />
                                    ))
                        }
                    </div>
                    <div className="panel-block">

                        {
                            mapsData && mapsData.getMaps &&
                            <Pagination pageCount={mapsData.getMaps.totalPageCount} currentPage={page} onPageChange={handlePageChange} />
                        }
                        <div className="field is-centered has-addons has-addons-centered">
                            <div className="control">
                                <input
                                    className="input is-medium"
                                    type="text"
                                    placeholder="Enter new map name"
                                    value={newMapName}
                                    onChange={handleNewMapNameChange}
                                />
                            </div>
                            <div className="control">
                                <button className="button is-info is-medium" onClick={handleAddMap} disabled={newMapName.length === 0}>
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

    );
}

export default MapSelect;