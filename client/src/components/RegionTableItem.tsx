import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt as farTrashAlt, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';

import unknownFlag from '../media/unknown_flag.jpg';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type Props = {
    mapId?: string,
    _id?: string,
    name: string,
    capital: string,
    leader: string,
    landmarks: string[],
    empty?: boolean
};

const RegionTableItem = ({ mapId, _id, name, capital, leader, landmarks, empty }: Props) => {
    return (
        <tr className="is-size-5 has-background-light-grey">

            <td className="">
                {
                    empty ? <div></div> :
                        <Link to={`/maps/${mapId}?subregion=${_id}`}>
                            <button className="pt-0 button is-ghost has-text-primary is-size-5">
                                {name}
                            </button>
                        </Link>
                }
            </td>
            <td className="pt-4">{capital}</td>
            <td className="pt-4">{leader}</td>
            <td className="is-flex is-justify-content-center">
                <figure className="image is-48x48 pt-1 my-1">
                    <img src={unknownFlag} alt="not found" className={`${empty ? "is-invisible" : ""}`} />
                </figure>
            </td>
            <td className="pt-4">{landmarks}</td>
            <td className="pt-4">
                {
                    <div className={`buttons are-small is-centered ${empty ? "is-invisible" : ""}`}>
                        <button className="button is-light is-info has-text-info" disabled={false} onClick={() => { }}>
                            <span
                                className={`icon click-icon ${false ? "has-text-grey-lighter" : "has-text-info"}`}

                            >
                                <FontAwesomeIcon icon={farEdit} size="lg" />
                            </span>
                        </button>
                        <button className="button is-light is-danger has-text-danger-dark">
                            <span className="icon" >
                                <FontAwesomeIcon icon={farTrashAlt} size="lg" />
                            </span>
                        </button>
                    </div>
                }


            </td>
        </tr>
    );
};

export default RegionTableItem;