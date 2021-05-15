import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt as farTrashAlt, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';

import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { TPS } from '../utils/tps';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';
import { ADD_REGION, DELETE_REGION, EDIT_REGION } from '../gql/regionMutations';
import { IEditRegion, IGetRegions, Region } from '../types/Region';
import { getFlagURL, truncateString } from '../utils/utils';

type Props = {
    selectedRow: number,
    selectedCol: number,
    row: number,
    moveSelection: (row: number, col: number) => void,
    tps: TPS,
    displayPath: string[],
    mapId?: string,
    region?: Region,
    empty?: boolean,
    sortBy: 'name' | 'capital' | 'leader' | undefined,
    reversed: boolean,
    handleDelete: (region: Region) => void,
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetRegions>>
};

const RegionTableItem = ({ row, selectedRow, selectedCol, moveSelection, tps, mapId, region, empty, handleDelete, refetch, sortBy, reversed, displayPath }: Props) => {

    const [editingName, setEditingName] = useState(false);
    const [editingCapital, setEditingCapital] = useState(false);
    const [editingLeader, setEditingLeader] = useState(false);

    const [name, setName] = useState(region ? region.name : "");
    const [capital, setCapital] = useState(region ? region.capital : "");
    const [leader, setLeader] = useState(region ? region.leader : "");

    useEffect(() => {
        (async () => {
            if (editingName) {
                await handleEditName();
            }
            else if (editingCapital) {
                await handleEditCapital();
            }
            else if (editingLeader) {
                await handleEditLeader();
            }
            setEditingName(row === selectedRow && selectedCol === 0);
            setEditingCapital(row === selectedRow && selectedCol === 1);
            setEditingLeader(row === selectedRow && selectedCol === 2);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRow, selectedCol]);

    const [editRegion] = useMutation<IEditRegion>(EDIT_REGION);

    const { tpsAdd, tpsClear } = tps;
    let history = useHistory();

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

    const handleEditName = async () => {
        const newName = name;
        if (newName.length > 0 && region && newName !== region.name)
            await handleEdit('name', newName);
    };

    const handleEditingName = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    };

    const handleEditCapital = async () => {
        const newCapital = capital;
        if (newCapital.length > 0 && region && newCapital !== region.capital)
            await handleEdit('capital', newCapital);
    };

    const handleEditingCapital = (e: React.FormEvent<HTMLInputElement>) => {
        setCapital(e.currentTarget.value);
    }

    const handleEditLeader = async () => {
        const newLeader = leader;
        if (newLeader.length > 0 && region && newLeader !== region.leader)
            await handleEdit('leader', newLeader);
    };

    const handleEditingLeader = (e: React.FormEvent<HTMLInputElement>) => {
        setLeader(e.currentTarget.value);
    }

    return (
        <tr className="has-background-light-grey table-row">

            <td className="py-1 pl-4 table-col">
                {
                    empty || !region ? <div></div> :

                        <div className="buttons">
                            {
                                editingName
                                    ?
                                    <input className="input is-size-6 name-input" type="text" defaultValue={region.name} onChange={handleEditingName} onBlur={() => moveSelection(-1, -1)} autoFocus={true} />
                                    :
                                    <button className="button is-ghost has-text-info is-justify-content-start is-size-6 name-input mx-0"
                                        onClick={() => {
                                            tpsClear();
                                            history.push({
                                                pathname: `/maps/${mapId}`,
                                                search: `subregion=${region._id}${sortBy ? `&sortBy=${sortBy}` : ""}&reversed=${reversed}`
                                            })
                                        }}>
                                        {truncateString(region.name, 25)}
                                    </button>
                            }

                            <button className="button is-small is-light is-info has-text-info" disabled={false} onClick={() => moveSelection(row, 0)}>
                                <span
                                    className={`icon click-icon ${false ? "has-text-grey-lighter" : "has-text-info"}`}

                                >
                                    <FontAwesomeIcon icon={farEdit} size="lg" />
                                </span>
                            </button>
                        </div>


                }
            </td>
            <td className="py-1 pl-5">{
                region && (editingCapital
                    ?
                    <input className="input" type="text" defaultValue={region.capital} onChange={handleEditingCapital} onBlur={() => moveSelection(-1, -1)} autoFocus={true} />
                    :
                    <div className="is-size-6 pt-2 is-clickable" onClick={() => moveSelection(row, 1)}>{truncateString(region.capital, 25)}</div>
                )}</td>
            <td className="py-1 pl-5">{
                region && (editingLeader
                    ?
                    <input className="input" type="text" defaultValue={region.leader} onChange={handleEditingLeader} onBlur={() => moveSelection(-1, -1)} autoFocus={true} />
                    :
                    <div className="is-size-6 pt-2 is-clickable" onClick={() => moveSelection(row, 2)}>{truncateString(region.leader, 20)}</div>
                )}</td>
            <td className="pb-0 pt-1 ">
                <figure className={`image is-48x48 pt-3 px-1 ${!empty && "has-background-grey-lighter"}`}>
                    <img src={getFlagURL(displayPath, region?.name)} onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = '/flags/unknown_flag.jpg' }} className={`${empty ? "is-invisible" : ""}`} />
                </figure>
            </td>
            <td className="py-1">{
                empty || !region ? <div></div> :
                    <button
                        className="button is-ghost has-text-info is-size-6 has-text-center"
                        onClick={() => {
                            tpsClear();
                            history.push({
                                pathname: `/maps/${mapId}/view`,
                                search: `subregion=${region._id}${sortBy ? `&sortBy=${sortBy}` : ""}&reversed=${reversed}`
                            })
                        }}>
                        {
                            region.landmarks.length > 0
                                ?
                                truncateString(region.landmarks.map((landmark) => landmark.name).join(', '), 30)
                                : "None"
                        }
                    </button>

            }</td>
            <td className="py-3">
                {
                    !empty && region && <button className="button px-3 is-small is-light is-danger has-text-danger-dark" onClick={() => handleDelete(region)}>
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