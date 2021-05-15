import { UserResult } from '../types/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt as farTrashAlt, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map } from '../types/Map';
import { IEditLandmark, IGetLandmarks, Landmark } from '../types/Region';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';
import { TPS } from '../utils/tps';
import { EDIT_LANDMARK } from '../gql/regionMutations';

type Props = {
    currentRegionId: string | null,
    landmark: Landmark,
    tps: TPS,
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetLandmarks>>,
    deleteCallback: (landmark: Landmark) => void
}

const LandmarkItem = ({ landmark, currentRegionId, tps, refetch, deleteCallback }: Props) => {

    const [editingName, setEditingName] = useState(false);

    const { name: originalName, owner, ownerName, _id } = landmark;

    const [name, setName] = useState(originalName);

    const [editLandmark] = useMutation<IEditLandmark>(EDIT_LANDMARK);

    const { tpsAdd, tpsClear } = tps;

    const handleEdit = async (newName: string) => {
        if (!landmark || !currentRegionId)
            return;
        const landmarkToEdit = {
            _id: _id,
            name: originalName
        };
        const previousName = originalName;
        await tpsAdd({
            redo: async () => {
                landmarkToEdit.name = newName;
                const { data } = await editLandmark({ variables: { regionId: currentRegionId, editLandmark: landmarkToEdit } });
                if (!data) {
                    console.error("Unknown error occurred.")
                    return;
                }

                const editStatus = data.editLandmark;
                if (editStatus.error)
                    console.error(editStatus.error);
                else {
                    await refetch();
                }
            },
            undo: async () => {
                landmarkToEdit.name = previousName;
                const { data } = await editLandmark({ variables: { regionId: currentRegionId, editLandmark: landmarkToEdit } });
                if (!data) {
                    console.error("Unknown error occurred.")
                    return;
                }

                const editStatus = data.editLandmark;
                if (editStatus.error)
                    console.error(editStatus.error);
                else {
                    await refetch();
                }
            }
        });
    }

    const handleEditingName = async (e: React.FormEvent<HTMLInputElement>) => {
        const newName = e.currentTarget.value;

        if (newName.length > 0) {
            setName(newName);
            await handleEdit(newName);
        }

        setEditingName(false);
    };

    return (
        <a className="panel-block panel-block-landmark panel-map-item pl-5" >
            <div className="level">
                <div className="level-left">
                    <div className="level-item">
                        {
                            editingName
                                ?
                                <input className="input is-size-6" type="text" placeholder="Enter map name" defaultValue={name} onBlur={handleEditingName} autoFocus={true} />
                                :
                                <div className={`${owner === currentRegionId ? "has-text-dark py-0" : "has-text-grey-light pt-1"} is-size-6 has-text-weight-semibold my-0`}>{name}</div>
                        }
                    </div>
                    {
                        owner !== currentRegionId &&
                        <div className="level-item">
                            <div className="has-text-grey-light has-text-weight-semibold is-size-6 pt-1 my-0">({ownerName})</div>
                        </div>
                    }

                </div>
                {
                    owner === currentRegionId &&
                    <div className="level-right ">
                        <div className="level-item">
                            <button className="button is-small is-light is-info has-text-info py-0 my-0" disabled={editingName || owner !== currentRegionId} onClick={() => { setEditingName(true); }}>
                                <span className={`icon click-icon ${editingName ? "has-text-grey-lighter" : "has-text-info"}`}>
                                    <FontAwesomeIcon icon={farEdit} size="lg" />
                                </span>
                            </button>

                        </div>

                        <div className="level-item">
                            <button
                                className="button is-small is-light is-danger has-text-danger-dark py-0 my-0"
                                disabled={owner !== currentRegionId}
                                onClick={() => deleteCallback(landmark)}>
                                <span className="icon" >
                                    <FontAwesomeIcon icon={farTrashAlt} size="lg" />
                                </span>
                            </button>

                        </div>
                    </div>
                }
            </div>


        </a>
    );
}

export default LandmarkItem;