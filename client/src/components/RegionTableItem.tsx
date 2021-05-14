import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt as farTrashAlt, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';

import unknownFlag from '../media/unknown_flag.jpg';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTPS } from '../utils/tps';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';
import { ADD_REGION, DELETE_REGION, EDIT_REGION } from '../gql/regionMutations';
import { IEditRegion, IGetRegions, Region } from '../types/Region';
import { truncateString } from '../utils/utils';

type Props = {
    mapId?: string,
    region?: Region,
    empty?: boolean,
    handleDelete: (region: Region) => Promise<void>,
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetRegions>>
};

const RegionTableItem = ({ mapId, region, empty, handleDelete, refetch }: Props) => {

    const [editingName, setEditingName] = useState(false);
    const [editingCapital, setEditingCapital] = useState(false);
    const [editingLeader, setEditingLeader] = useState(false);

    const [editRegion] = useMutation<IEditRegion>(EDIT_REGION);

    const { tpsAdd } = useTPS();

    const handleEdit = async (field: 'name' | 'capital' | 'leader', value: string) => {
        if (!region)
            return;
        const regionToEdit = {
            _id: region._id,
            name: region.name,
            capital: region.capital,
            leader: region.leader
        };
        const previousValue = regionToEdit[field];
        await tpsAdd({
            redo: async () => {
                regionToEdit[field] = value;
                const { data } = await editRegion({ variables: { regionToEdit: regionToEdit } });
                if (!data) {
                    console.error("Unknown error occurred.")
                    return;
                }

                const editStatus = data.editRegion;
                if (editStatus.error)
                    console.error(editStatus.error);
                else {
                    await refetch();
                }
            },
            undo: async () => {
                regionToEdit[field] = previousValue;
                const { data } = await editRegion({ variables: { regionToEdit: regionToEdit } });
                if (!data) {
                    console.error("Unknown error occurred.")
                    return;
                }

                const editStatus = data.editRegion;
                if (editStatus.error)
                    console.error(editStatus.error);
                else {
                    await refetch();
                }
            }
        });
    };

    const handleEditName = async (e: React.FormEvent<HTMLInputElement>) => {
        const newName = e.currentTarget.value;
        if (newName.length > 0)
            await handleEdit('name', newName);
        setEditingName(false);
    };

    const handleEditCapital = async (e: React.FormEvent<HTMLInputElement>) => {
        const newCapital = e.currentTarget.value;
        if (newCapital.length > 0)
            await handleEdit('capital', newCapital);
        setEditingCapital(false);
    };

    const handleEditLeader = async (e: React.FormEvent<HTMLInputElement>) => {
        const newLeader = e.currentTarget.value;
        if (newLeader.length > 0)
            await handleEdit('leader', newLeader);
        setEditingLeader(false);
    };

    return (
        <tr className="has-background-light-grey table-row">

            <td className="py-0 pl-4 table-col">
                {
                    empty || !region ? <div></div> :

                        <div className="buttons">
                            {
                                editingName
                                    ?
                                    <input className="input is-size-6 name-input" type="text" defaultValue={region.name} onBlur={handleEditName} autoFocus={true} />
                                    :
                                    <Link to={{
                                        pathname: `/maps/${mapId}`,
                                        search: `subregion=${region._id}`
                                    }}>
                                        <button className="button is-ghost has-text-info is-size-6 name-input">
                                            {truncateString(region.name, 25)}
                                        </button>
                                    </Link>
                            }

                            <button className="button is-small is-light is-info has-text-info" disabled={false} onClick={() => setEditingName(true)}>
                                <span
                                    className={`icon click-icon ${false ? "has-text-grey-lighter" : "has-text-info"}`}

                                >
                                    <FontAwesomeIcon icon={farEdit} size="lg" />
                                </span>
                            </button>
                        </div>


                }
            </td>
            <td className="py-0 pl-5">{
                region && (editingCapital
                    ?
                    <input className="input" type="text" defaultValue={region.capital} onBlur={handleEditCapital} autoFocus={true} />
                    :
                    <div className="is-size-6 pt-2" onClick={() => setEditingCapital(true)}>{truncateString(region.capital, 25)}</div>
                )}</td>
            <td className="py-0 pl-5">{
                region && (editingLeader
                    ?
                    <input className="input" type="text" defaultValue={region.leader} onBlur={handleEditLeader} autoFocus={true} />
                    :
                    <div className="is-size-6 pt-2" onClick={() => setEditingLeader(true)}>{truncateString(region.leader, 20)}</div>
                )}</td>
            <td className="py-0">
                <figure className="image is-48x48 pt-2 pl-0">
                    <img src={unknownFlag} alt="not found" className={`${empty ? "is-invisible" : ""}`} />
                </figure>
            </td>
            <td className="py-0">{
                empty || !region ? <div></div> :
                    <Link to={{
                        pathname: `/maps/${mapId}/view`,
                        search: `subregion=${region._id}`
                    }}>
                        <button className="button is-ghost has-text-info is-size-6 has-text-center">
                            {
                                region.landmarks.length > 0
                                    ?
                                    truncateString(region.landmarks.join(', '), 30)
                                    : "None"
                            }
                        </button>
                    </Link>

            }</td>
            <td className="py-3">
                {
                    !empty && region && <button className="button is-small is-light is-danger has-text-danger-dark" onClick={() => handleDelete(region)}>
                        <span className="icon" >
                            <FontAwesomeIcon icon={farTrashAlt} size="lg" />
                        </span>
                    </button>
                }

            </td>
        </tr>
    );
};

export default RegionTableItem;