import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltDown, faLongArrowAltUp, faUndoAlt, faRedoAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

import { faPlusSquare as farPlusSquare } from '@fortawesome/free-regular-svg-icons';

import Pagination from './Pagination';
import RegionTableItem from './RegionTableItem';
import { useMutation, useQuery } from '@apollo/client';
import { GET_REGIONS } from '../gql/regionQueries';
import React, { useEffect, useState } from 'react';
import { IAddRegion, IGetRegions } from '../types/Region';
import { useHistory, useLocation, useParams } from 'react-router';
import { ADD_REGION } from '../gql/regionMutations';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';


type Params = {
    mapId: string;
}

const RegionTable = () => {

    const routeParams = useParams<Params>();

    let location = useLocation();

    const searchParams = new URLSearchParams(location.search);

    const [parentId, setParentId] = useState(
        searchParams.get("subregion") ? searchParams.get("subregion") : routeParams.mapId
    );



    useEffect(() => {
        console.log(location)
        const searchParams = new URLSearchParams(location.search);
        setParentId(searchParams.get("subregion") ? searchParams.get("subregion") : routeParams.mapId)
    }, [location, routeParams.mapId]);

    const perPage = 6;

    const [page, setPage] = useState(1);

    const { data: regionData, loading: regionLoading, error: errorLoading, refetch: refetchRegions } = useQuery<IGetRegions>(GET_REGIONS, {
        variables: {
            parentId: parentId,
            perPage: perPage,
            page: page
        }
    });

    // const [regionData, regionLoading, refetchRegions] = [{ getRegions: { regions: [], totalPageCount: 0 } }, true, () => { }];

    const [addRegion] = useMutation<IAddRegion>(ADD_REGION);

    useEffect(() => {
        (async () => {
            await refetchRegions();
        })()
    }, [page, refetchRegions, parentId, location]);

    const handlePageChange = async (newPage: number) => {
        setPage(newPage);
    }

    const handleAddRegion = async () => {
        const { data } = await addRegion({ variables: { parentId: parentId } });
        if (!data) {
            console.error("Unknown error occurred.")
            return;
        }

        const addStatus = data.addRegion;

        if (addStatus.error)
            console.error(addStatus.error)
        else {
            await refetchRegions();
        }
    };

    return (
        <div className="container" >


            <div className={`level mt-0 mb-${searchParams.get("subregion") ? "0" : "5"}`}>
                <div className="level-left">
                    <div className="level-item buttons">
                        <button className="button is-dark" disabled>
                            <span className="icon">
                                <FontAwesomeIcon icon={faUndoAlt} size="lg" />
                            </span>
                        </button>
                        <button className="button is-dark" disabled>
                            <span className="icon">
                                <FontAwesomeIcon icon={faRedoAlt} size="lg" />
                            </span>
                        </button>

                    </div>

                </div>

                <div className="level-item block has-text-centered">
                    <div className="title has-text-weight-medium">Region name: </div>
                    {
                        searchParams.get("subregion") ?
                            <Link to={{
                                pathname: `${location.pathname}/view`,
                                search: location.search
                            }}>
                                <div className={`title has-text-weight-medium button has-text-primary is-ghost`}>{
                                    !regionLoading &&
                                        regionData && regionData.getRegions
                                        ? regionData.getRegions.displayPath[regionData.getRegions.displayPath.length - 1]
                                        : ""
                                }
                                </div>
                            </Link> :
                            <div className={`title has-text-weight-medium pl-5`}>{
                                !regionLoading &&
                                    regionData && regionData.getRegions
                                    ? regionData.getRegions.displayPath[regionData.getRegions.displayPath.length - 1]
                                    : ""
                            }
                            </div>
                    }

                </div>
            </div>


            <table className="table is-fullwidth is-rounded has-text-centered mb-0">
                <thead >
                    <tr className="has-background-info">
                        <th>
                            <button
                                className={`${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button icon-text is-ghost has-text-light has-text-weight-semibold is-size-5`}
                            >
                                <span>Name</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} className="has-text-info-dark" />
                                    <FontAwesomeIcon icon={faLongArrowAltDown} className="has-text-info-dark" />
                                </span>
                            </button>

                        </th>
                        <th>
                            <button className={`${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button icon-text is-ghost has-text-light has-text-weight-semibold is-size-5`}>
                                <span>Capital</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} className="has-text-info-dark" />
                                    <FontAwesomeIcon icon={faLongArrowAltDown} className="has-text-info-dark" />
                                </span>
                            </button>

                        </th>
                        <th>
                            <button className={`${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button icon-text is-ghost has-text-light has-text-weight-semibold is-size-5`}>
                                <span>Leader</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} className="has-text-info-dark" />
                                    <FontAwesomeIcon icon={faLongArrowAltDown} className="has-text-info-dark" />
                                </span>
                            </button>
                        </th>
                        <th>
                            <button className={`${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button icon-text is-ghost has-text-light has-text-weight-semibold is-size-5`}>
                                <span>Flag</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} className="has-text-info-dark" />
                                    <FontAwesomeIcon icon={faLongArrowAltDown} className="has-text-info-dark" />
                                </span>
                            </button>

                        </th>
                        <th>
                            <button className={`${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button icon-text is-ghost has-text-light has-text-weight-semibold is-size-5`}>
                                <span>Landmarks</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} className="has-text-info-dark" />
                                    <FontAwesomeIcon icon={faLongArrowAltDown} className="has-text-info-dark" />
                                </span>
                            </button>

                        </th>
                        <th>
                            <button className={`${regionLoading || !regionData || !regionData.getRegions ? "is-invisible" : ""} button is-primary is-light my-2 is-small`} onClick={handleAddRegion}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faPlus} size="2x" />
                                </span>
                            </button>

                        </th>
                    </tr>
                </thead>
                <tbody>

                    {
                        regionLoading || !regionData || !regionData.getRegions
                            ?
                            <tr>
                                <td></td>
                                <td></td>
                                <div className="is-fullwidth pt-6 mt-5 table-body-container">
                                    <Loader color="hsl(0, 0%, 86%)" type="TailSpin" />
                                </div>
                            </tr>
                            :
                            Object.assign(new Array(perPage).fill(null), regionData?.getRegions.regions).map((region, index) => (
                                region
                                    ?
                                    <RegionTableItem key={region._id} mapId={routeParams.mapId} _id={region._id} name={region.name} capital={region.capital} leader={region.leader} landmarks={region.landmarks} />
                                    :
                                    <RegionTableItem key={`empty_${index}`} name="" capital="" leader="" landmarks={[]} empty />
                            ))
                    }
                </tbody>


            </table>
            <div className="container has-background-white py-1 px-1">
                <Pagination
                    pageCount={regionData && regionData.getRegions ? regionData.getRegions.totalPageCount : 0}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />

            </div>

        </div>

    );
};

export default RegionTable;