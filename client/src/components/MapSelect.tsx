import { UserResult } from '../types/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import MapSelectItem from './MapSelectItem';
import { useMutation, useQuery } from '@apollo/client';
import { IAddMap, IDeleteMap, IGetAllMaps, IRenameMap } from '../types/Map';
import { GET_ALL_MAPS } from '../gql/mapQueries';
import { ADD_MAP, DELETE_MAP, RENAME_MAP } from '../gql/mapMutations';
import Loader from 'react-loader-spinner';

type Props = {
    user?: UserResult;
    fadeIn?: boolean;
}

const MapSelect = ({ user, fadeIn }: Props) => {

    const { data: mapsData, loading: mapsLoading, error: mapsError, refetch: refetchMaps } = useQuery<IGetAllMaps>(GET_ALL_MAPS);

    const [addMap] = useMutation<IAddMap>(ADD_MAP);
    const [deleteMap] = useMutation<IDeleteMap>(DELETE_MAP);
    const [renameMap] = useMutation<IRenameMap>(RENAME_MAP);

    const handleAddMap = async () => {
        const { data } = await addMap();
        if (!data) {
            console.error("Unknown error occurred.")
            return;
        }


        const addStatus = data.addMap;

        if (addStatus.error)
            console.error(addStatus.error)
        else
            await refetchMaps();
    };

    const handleDeleteMap = async (_id: string) => {
        const { data } = await deleteMap({ variables: { _id: _id } });
        if (!data) {
            console.error("Unknown error occurred.")
            return;
        }

        const deleteStatus = data.deleteMap;
        if (deleteStatus.error)
            console.error(deleteStatus.error);
        else
            await refetchMaps();
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
        else
            await refetchMaps();
    }

    return (
        <div className={`card has-text-centered ${fadeIn ? "fade-in" : ""}`} >

            <nav className="panel">
                <p className="panel-heading">
                    <span className="is-size-4">Maps</span>

                </p>
                <div className="container is-scrollable">
                    {
                        mapsError ? `Error loading maps ${mapsError}`
                            :
                            mapsLoading ? <Loader color="#363636" type="TailSpin" />
                                :
                                mapsData && mapsData.getAllMaps.maps.map((map) => (
                                    <MapSelectItem key={map._id} name={map.name} _id={map._id} deleteCallback={handleDeleteMap} renameCallback={handleRenameMap} />
                                ))
                    }
                </div>
                <div className="panel-block">
                    <button className="button is-info is-light" onClick={handleAddMap}>
                        <span className="icon-text level">
                            <span className="level-item has-text-weight-semibold">Add new map</span>
                            <span className="icon level-item">
                                <FontAwesomeIcon icon={faPlus} size="sm" />
                            </span>

                        </span>
                    </button>
                </div>
            </nav>

        </div>
    );
}

export default MapSelect;