import React, { useState, useEffect, useContext } from 'react'
import GlobalContext from '../../context/GlobalContext';
import LeaderboardHeader from './LeaderboardHeader';
import LeaderBoardIndividual from './LeaderBoardIndividual';

export default function LeaderboardView() {
    const { currentGroup, allGroupsInfo, allUsers, groupsRankInfo, setGroupsRankInfo } = useContext(GlobalContext);

    const [rankUsers, setRankUsers] = useState([]);

    const [managerEmail, setManagerEmail] = useState("");

    const token = `Token ${localStorage.getItem("Token")}`;

    async function getCurrentGroupInfo(){
        allGroupsInfo.forEach(element => {
            if(element.name === currentGroup){
                getAllRankUsersInfo(element);
            }
        })
    }

    function getUserRankInfoFromGroup() {
        if(currentGroup === "") return;
        const axios = require('axios');
        return axios.get(`/groups/${encodeURI(currentGroup)}/group_ranking/`, {
            headers: {
              'Authorization': token
            }
          }).then(function ({data}) {
                // handle success
                setGroupsRankInfo(data)
            })
    }

    async function getAllRankUsersInfo(currentGroupInfo){
        setManagerEmail(currentGroupInfo.manager);
        let currentUserList = [];
        for(let i = 0; i < currentGroupInfo.members.length; i++){
            for(let j = 0; j < allUsers.length; j++){
                if(allUsers[j].email === currentGroupInfo.members[i]){
                    currentUserList.push(allUsers[j]);
                }
            }
        }
        await getUserRankInfoFromGroup();
        if(currentUserList !== 0 && groupsRankInfo.length !== 0){
            for(let i = 0; i < currentUserList.length; i++){
                currentUserList[i].score = groupsRankInfo[currentUserList[i].email];
            }
        }
        setRankUsers(currentUserList);
    }

    useEffect(() => {
        getCurrentGroupInfo();
    }, [currentGroup])

    return (
        <div>
            <LeaderboardHeader />
            <div className="h-screen flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <span className="material-icons-outlined  text-gray-600 px-1">
                                                badge
                                            </span>
                                            <p className="">Name</p>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <span className="material-icons-outlined  text-gray-600 px-2">
                                                sports_score
                                            </span>
                                            <p className="">Score</p>
                                        </th>
                                        <th scope="col" className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <span className="material-icons-outlined  text-gray-600 px-1">
                                                account_box
                                            </span>
                                            <p className="">Role</p>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <span className="material-icons-outlined  text-gray-600 px-1">
                                                stars
                                            </span>
                                            <p className="">Rank</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rankUsers.sort((u1, u2) => (u2.score - u1.score)).map((user, idx) =>
                                        <LeaderBoardIndividual userInfo={user} key={idx} rank={idx} managerEmail={managerEmail}/>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
