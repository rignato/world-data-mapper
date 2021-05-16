import { UserResult } from '../types/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt as farTrashAlt, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Map } from '../types/Map';
import { TPS } from '../utils/tps';

type Props = {
    tps: TPS,
    name: string,
    _id: string,
    renameCallback: (_id: string, name: string) => Promise<void>,
    deleteCallback: (map: Map) => void
}

const MapSelectItem = ({ tps, _id, name: originalName, renameCallback, deleteCallback }: Props) => {

    const [editingName, setEditingName] = useState(false);

    const [name, setName] = useState(originalName);

    let history = useHistory();

    const handleEditingName = async (e: React.FormEvent<HTMLInputElement>) => {
        const newName = e.currentTarget.value;

        if (newName.length > 0) {
            setName(newName);
            await renameCallback(_id, newName);
        }

        setEditingName(false);
    };

    const handleDelete = async (e: React.MouseEvent<HTMLElement>) => {
        await deleteCallback({ _id: _id, name: name });
    }

    const { tpsClear } = tps;

    return (
        <a className="panel-block panel-map-item" >
            <div className="level">
                <div className="level-left">
                    <div className="level-item">
                        {
                            editingName
                                ?
                                <input className="input is-size-5" type="text" placeholder="Enter map name" defaultValue={name} onBlur={handleEditingName} autoFocus={true} />
                                :
                                <button className="button is-ghost has-text-info is-size-5" onClick={
                                    () => {
                                        tpsClear();
                                        history.push(`/maps/${_id}`)
                                    }

                                }>{name}</button>
                        }
                    </div>

                </div>
                <div className="level-right">
                    <div className="level-item">
                        <button className="button is-light is-info has-text-info" disabled={editingName} onClick={() => { setEditingName(true); }}>
                            <span
                                className={`icon click-icon ${editingName ? "has-text-grey-lighter" : "has-text-info"}`}

                            >
                                <FontAwesomeIcon icon={farEdit} size="lg" />
                            </span>
                        </button>

                    </div>

                    <div className="level-item">
                        <div className="button is-light is-danger has-text-danger-dark" onClick={handleDelete}>
                            <span className="icon" >
                                <FontAwesomeIcon icon={farTrashAlt} size="lg" />
                            </span>
                        </div>

                    </div>

                </div>

            </div>


        </a>
    );
}

export default MapSelectItem;