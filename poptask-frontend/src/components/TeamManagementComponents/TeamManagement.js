import React, { Component } from 'react'
import Box from './Box';
import Example from './Example';

class TeamManagement extends Component {
    constructor(props) {
        super(props)

        const e1 = {
            id: 1,
            firstName: 'Elon',
            lastName: 'Musk',
            emailId: 'e@gcka.cok'

        }
        const e2 = {
            id: 2,
            firstName: 'Elo2',
            lastName: 'Musk',
            emailId: 'e@gcka.cok'

        }
        const e3 = {
            id: 3,
            firstName: 'Elo3',
            lastName: 'Musk',
            emailId: 'e@gcka.cok'

        }
        const g1 = {
            id: 1,
            name: 'g1',
            members: [e1, e3]
        }
        const g2 = {
            id: 2,
            name: 'g2',
            members: [e1, e2, e3]
        }
        const groups = [g1, g2];

        this.state = {
            groups: groups
        }
    }
    deleteGroup(groupId) {
        for (const group of this.state.groupList) {
            if (group.id === groupId) {
                this.state.groupList.remove(group);
            }
        }
    }
    deleteMember(group, memberId) {
        let members = group.members;
        const newMembers = members.filter((member => member.id !== memberId));
        console.log(this.state)
        let newGroups = this.state.groups.slice();
        for (const newGroup of newGroups) {
            if (group.id === newGroup.id) {
                newGroup.members = newMembers;
            }
        }

        this.setState({ groups: newGroups })
    }

    render() {
        return (
            <div id="team-management" className="flex">
                <div className="flex-auto">
                    {this.state.groups.map((g) => {
                        return (
                            <Box key={g.id} group={g}
                                deleteMember={(group, member) => this.deleteMember(group, member)} />
                        )
                    })}
                </div>
            </div>
        )
    }

}

export default TeamManagement