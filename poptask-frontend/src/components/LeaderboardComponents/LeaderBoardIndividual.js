import React, {useContext} from 'react'
import GlobalContext from '../../context/GlobalContext';

export default function LeaderBoardIndividual({ userInfo, rank, managerEmail }) {
    const { groupsRankInfo } = useContext(GlobalContext);
    const uEmail = userInfo.email;

    return (
        <React.Fragment>
            <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        {
                            rank === 0 ?
                                <img className="h-10 w-10 rounded-full" src="https://data.whicdn.com/images/299530921/original.png" alt="" />
                                :
                                <img className="h-10 w-10 rounded-full" src="https://pbs.twimg.com/media/Dc29UPjV4AABW7u.png" alt="" />
                        }
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {userInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {userInfo.email}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                        {groupsRankInfo[uEmail]}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {managerEmail === userInfo.email ? "Owner" : "Member"}
                </td>
                <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-500">
                    {`No.${rank + 1}`}
                </td>
            </tr>
        </React.Fragment>
    )
}
