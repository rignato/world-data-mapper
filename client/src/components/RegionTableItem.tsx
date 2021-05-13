import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt as farTrashAlt, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';

import unknownFlag from '../media/unknown_flag.jpg';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTPS } from '../utils/tps';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';
import { ADD_REGION, DELETE_REGION } from '../gql/regionMutations';
import { IGetRegions, Region } from '../types/Region';

type Props = {
    mapId?: string,
    region?: Region,
    empty?: boolean,
    handleDelete: (region: Region) => Promise<void>,
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetRegions>>
};

const RegionTableItem = ({ mapId, region, empty, handleDelete }: Props) => {

    return (
        <tr className="is-size-5 has-background-light-grey">

            <td className="">
                {
                    empty || !region ? <div></div> :

                        <div className="buttons is-centered">
                            <Link to={{
                                pathname: `/maps/${mapId}`,
                                search: `subregion=${region._id}`
                            }}>
                                <button className="pt-0 button is-ghost has-text-primary is-size-5">
                                    {region.name}
                                </button>
                            </Link>
                            <button className="button is-small is-light is-info has-text-info" disabled={false} onClick={() => { }}>
                                <span
                                    className={`icon click-icon ${false ? "has-text-grey-lighter" : "has-text-info"}`}

                                >
                                    <FontAwesomeIcon icon={farEdit} size="lg" />
                                </span>
                            </button>
                        </div>


                }
            </td>
            <td className="pt-4">{region ? region.capital : ""}</td>
            <td className="pt-4">{region ? region.leader : ""}</td>
            <td className="is-flex is-justify-content-center">
                <figure className="image is-48x48 pt-1 my-1">
                    <img src={unknownFlag} alt="not found" className={`${empty ? "is-invisible" : ""}`} />
                </figure>
            </td>
            <td className="pt-4">{
                empty || !region ? <div></div> :
                    <Link to={{
                        pathname: `/maps/${mapId}/view`,
                        search: `subregion=${region._id}`
                    }}>
                        <button className="pt-1 pb-5 button is-ghost has-text-primary is-size-5 has-text-center">
                            {
                                region.landmarks.length > 0
                                    ?
                                    region.landmarks.join(', ').slice(0, 30).concat(" ...")
                                    : "None"
                            }
                        </button>
                    </Link>

            }</td>
            <td className="pt-4">
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