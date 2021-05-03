import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

import unknownFlag from '../media/unknown_flag.jpg';
import { IGetRegionById, Region } from "../types/Region";
import { useQuery } from "@apollo/client";
import { GET_REGION_BY_ID } from "../gql/regionQueries";
import { useLocation, useParams } from "react-router-dom";

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

    const { data: regionData, refetch: refetchRegionData } = useQuery<IGetRegionById>(GET_REGION_BY_ID, {
        variables: { _id: regionId },
        skip: !regionId
    });

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


    return (
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
                        <div className="card-content ">
                            <p className="title is-5 has-text-dark">Region name: {regionData.getRegionById.name}</p>
                            <p className="title is-5 has-text-dark">Parent region: {regionData.getRegionById.displayPath[regionData.getRegionById.displayPath.length - 1]}</p>
                            <p className="title is-5 has-text-dark">Region capital: {regionData.getRegionById.capital}</p>
                            <p className="title is-5 has-text-dark">Region leader: {regionData.getRegionById.leader}</p>
                            <p className="title is-5 has-text-dark"># of subregions: {regionData.getRegionById.subregionCount}</p>
                        </div>
                    </div>

                </div>
            }

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
        </div>
    );
};

export default RegionViewer;