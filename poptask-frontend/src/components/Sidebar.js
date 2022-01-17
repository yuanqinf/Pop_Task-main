import React,{useEffect, useState, useRef, useContext} from "react";
import GlobalContext from "../context/GlobalContext";
import AccountManagement from "./AccountManagement";

export default function Sidebar() {
    const [teamsInfo, setTeamsInfo] = useState([])
    const [selectedTeam, setSelectedTeam] = useState([])
    const [searchUserEmail, setSearchUserEmail] = useState("");
    const [groupNameEntry, setGroupNameEntry] = useState("");
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [delay, setDelay] = useState(500);

    const token = `Token ${localStorage.getItem("Token")}`;
    
    const currentUserEmail = localStorage.getItem("UserName");
    
    const { setCurrentGroup, currentUser, setCurrentUser, allUsers, setAllUsers, setAllGroupsInfo} 
        = useContext(GlobalContext);

    function getGroup() {
        const axios = require('axios');
        return axios.get('/groups/', {
            headers: {
              'Authorization': token
            }
          }).then(function ({data}) {
                // handle success
                setAllGroupsInfo(data);
                return (data);
            })
    }

    async function fetchGroupInfo(){
        let curUser = "";
        try {
            await getUsers().then((users) => {
                setAllUsers(users);
                for(let i = 0; i < users.length; i++){
                    if(users[i].email === localStorage.getItem("UserEmail")){
                        setCurrentUser(users[i]);
                        curUser = users[i];
                    }
                }
            });
            await getGroup().then((groups) => {
                setTeamsInfo(groups);
                if(isFirstTime){
                    const filteredGroups = groups.filter((groupVal) => curUser.mygroups.includes(groupVal.name))
                    setSelectedTeamArray(0, filteredGroups[0])
                    setIsFirstTime(false);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const setSelectedTeamArray = (teamIndex, teamVal) => {    
        if(teamVal === undefined) return;
        let teamArray = new Array(teamsInfo.length).fill(false);
        teamArray[teamIndex] = !teamArray[teamIndex];
        setCurrentGroup(teamVal.name);
        setSelectedTeam(teamArray);
    }

    function getUsers() {
        const axios = require('axios');
        return axios.get('/users', {
            headers: {
              'Authorization': token
            }
          })
            .then(function ({data}) {
                // handle success
                return (data);
            })
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();
        // Remember the latest function.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
      }

    useInterval(() => {
        fetchGroupInfo();
        // fetchUsersInfo();
    }, delay);

    useEffect(() => { 
        fetchGroupInfo();
        // fetchUsersInfo();
    }, [searchUserEmail, groupNameEntry])

    function createNewGroup() {
        console.log("creating new group");
        if(groupNameEntry === "") return;
        const axios = require('axios');
        return axios.post('/groups/', {
            "name": groupNameEntry
            }, {
                headers: {
                    'Authorization': token
                }
            }).then(function () {
                setGroupNameEntry("");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function removeGroupMember(memberName, memberList, groupName){
        console.log("remove a member");
        const filteredList = memberList.filter((member) => (member !== memberName));
        const axios = require('axios');
        return axios.put(`/groups/${encodeURI(groupName)}/`, {
            "members": filteredList
            }, {headers: {
                    'Authorization': token
                }
            }
            ).then(function () {
                console.log("removed")
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function removeUserItself(groupName){
        console.log("remove myself");
        const axios = require('axios');
        return axios.post(`/groups/${encodeURI(groupName)}/leave_group/`, {},
            {headers: {
                    'Authorization': token
            }})
            .then(function () {
                console.log("removed")
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    function inviteGroupMember(newMember, memberList, groupName){
        console.log("invite a member");
        if(currentUserEmail === newMember.email) return;
        const updatedList = [...memberList, newMember.email]
        const axios = require('axios');
        // todo remove user itself
        return axios.put(`/groups/${encodeURI(groupName)}/`, {
            "members": updatedList
            }, {headers: {
                'Authorization': token
            }})
            .then(function () {
                console.log("added")
                setSearchUserEmail("");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function getAllTasks(groupName) {
        const axios = require('axios');
        return axios.get(`/tasks/`
            , {headers: {
                    'Authorization': token
            }})
            .then(function (data) {
                console.log("get all tasks")
                return data['data']
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function deleteTask(id) {
        const axios = require('axios');
        return axios.delete(`/tasks/${id}/`
            , {headers: {
                'Authorization': token
            }})
            .then(function (data) {
                console.log("deleted task")
                return data
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function deleteGroupClicked(groupName){
        console.log("delete group");
        //modify info of users
        try {
            // Delete related tasks
            const allTasks = await getAllTasks()
            for(let i = 0; i < allTasks.length; i++){
                const task = allTasks[i];
                if (task['group'] === groupName) {
                    const res = await deleteTask(task['id'])
                    console.log(res)
                }
            }
            // delete group
            return await removeUserItself(groupName)

        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div>
            <div id="Main" className="flex items-start h-full  w-full sm:w-80 bg-blue-500 flex-col">
                {teamsInfo.filter((teamVal) => currentUser.mygroups.includes(teamVal.name)).map((value, index) => 
                    <div className="flex flex-col justify-start items-center px-6 border-b border-white-600 w-full" key={index}>
                        <button onClick={() => setSelectedTeamArray(index, value)} className= {`focus:outline-none hover:text-blue-200 ${selectedTeam[index] ? "text-blue-800": "text-white"} flex justify-between items-center w-full py-5 space-x-12`}>
                            <p className="text-base leading-4 font-semibold">{value.name}</p>
                            <svg id="icon1" className={`${selectedTeam[index] ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" 
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                        </button>
                        
                        <div id="menu1" className={`${selectedTeam[index] ? 'flex' : 'hidden'} justify-start  flex-col w-full md:w-auto items-start pb-1 `}>
                            {
                                value.members.map((memberVal, index) => 
                                    <React.Fragment key={index}>
                                        <div className="flex justify-start items-center space-x-6 rounded px-3 py-2  w-full md:w-52" key={index}>
                                            { memberVal === value.manager ?
                                                <p className="text-sm leading-4 text-green-400 text-base font-bold">{memberVal}</p> :
                                                <p className="text-sm leading-4 text-white">{memberVal}</p>
                                            }
                                            { currentUser.email !== memberVal && currentUser.email === value.manager ?
                                                <span onClick={() => removeGroupMember(memberVal, value.members, value.name)} className="material-icons-outlined cursor-pointer text-blue-200 hover:bg-red-500 rounded">
                                                    person_remove
                                                </span> : ""
                                            }
                                            { currentUser.email === memberVal && currentUser.email !== value.manager ? 
                                                <button
                                                    className="bg-blue-400 hover:bg-red-500 ml-12 mr-12 px-6 py-1 rounded text-white text-sm"
                                                    onClick={() => removeUserItself(value.name)}
                                                >
                                                    Exit
                                                </button> : ""
                                            }
                                        </div>
                                        { currentUser.email === memberVal && currentUser.email === value.manager ? 
                                            <div className="pt-2 relative text-gray-600 mt-2 mb-2">
                                                <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                                                        type="search" name="search" placeholder="Enter email to invite" value = {searchUserEmail} 
                                                        onChange={ (event) => setSearchUserEmail(event.target.value) }
                                                />
                                                <div className="absolute right-0 top-0 mt-4 mr-10">
                                                    <span className="material-icons-outlined">
                                                        search
                                                    </span>
                                                </div>
                                                {
                                                    allUsers.filter(user => user["email"] === searchUserEmail).map((userValue, index) => 
                                                        <div key={index} className="pt-2 relative mx-auto text-gray-600">
                                                            <div key={index} className="border-1 border-gray-300 bg-white h-10 px-4 pr-16 rounded-lg text-sm">
                                                                <p className="pt-2 mt-2 mr-5">{userValue.username}</p>
                                                            </div>
                                                            <button className="absolute right-0 top-0 mt-6 mr-5">
                                                                <span onClick = {() => inviteGroupMember(userValue, value.members, value.name)} className="material-icons-outlined hover:bg-blue-200 rounded cursor-pointer">
                                                                    person_add
                                                                </span>
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                                <button
                                                    className="bg-blue-400 hover:bg-yellow-500 ml-12 mr-12 px-6 py-1 rounded text-white text-sm mt-3"
                                                    onClick={() => deleteGroupClicked(value.name, currentUser.email, value.members)}
                                                >
                                                    Delete Group
                                                </button>
                                            </div> : ""
                                        }
                                    </React.Fragment>
                                )
                            }
                        </div>
                    </div>
                )}
                <div className="pt-2 relative text-gray-600 mt-2 mb-2 ml-8">
                    <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                            type="text" name="addGroup" placeholder="Enter new group name" value = {groupNameEntry} 
                            onChange={ (event) => setGroupNameEntry(event.target.value) }
                    />
                    <div className="absolute right-0 top-0 mt-3 mr-5">
                        <span onClick={() => createNewGroup()} className="material-icons-outlined hover:bg-green-200 rounded cursor-pointer">
                            group_add
                        </span>
                    </div>
                </div>
                <AccountManagement />
            </div>
        </div>
    );
}