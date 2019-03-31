import React from 'react';
import { Table } from 'antd';

const columns = [
    {
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'Sensitive',
        dataIndex: 'sensitive',
        key: 'sensitive',
    },
    {
        title: 'Enabled',
        dataIndex: 'enabled',
        key: 'enabled',
    },
];

class UserInfo extends React.Component {
    render() {
        return (
            <Table columns={columns}/>
        );
    }
}
export default UserInfo;