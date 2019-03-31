
/* global chrome */
import React from 'react';
import { Table, Checkbox, Typography, Input, Radio, Button, Icon } from 'antd';
import { changeConfirmLocale } from 'antd/lib/modal/locale';

const { Text } = Typography;

const columns = [
    {
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
        width: '10%',
        render: val => <Text type="secondary">{val}</Text>
    },
    {
        title: 'Value',
        dataIndex: 'val',
        key: 'value',
        render: (val, record) => <Text strong>{record.sensitive?"****":val}</Text>
    },
    {
        title: 'Sensitive',
        dataIndex: 'sensitive',
        key: 'sensitive',
        width: '10%',
    },
    {
        title: 'Enabled',
        dataIndex: 'enabled',
        key: 'enabled',
        width: '10%',
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        width: '10%',
    },
];

const tempData = [
    {
        key: 'Username',
        val: 'GalenWong',
        sensitive: false,
        enabled: true,
    }
];

const emptyCurrent = {
    key: '',
    val: '',
    sensitive: false,
};

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [...tempData],
            current: emptyCurrent,
        };
        columns[2].render = this.boolRender(columns[2].key);
        columns[3].render = this.boolRender(columns[3].key);
        columns[4].render = this.deleteRowRender;
        this.overwriteSetState();
    }

    boolRender = columnKey => {
        return (text, record) => {
            const updateBool = (e) => {
                const { data } = this.state;
                const newdata = data.map(v => {
                    if (v.key === record.key) {
                        v[columnKey] = e.target.checked; 
                    }
                    return v;
                })
                this.setState({ data: newdata });
            }
            return <Checkbox defaultChecked={text} onChange={updateBool} />
        }
    }
    
    deleteRowRender = (text, record) => {
        const deleteRow = () => {
            const { data } = this.state;
            const newdata = data.filter(v => v.key !== record.key);
            this.setState({ data: newdata });
        }
        return <Icon 
            onClick={deleteRow} 
            twoToneColor="#ff6363" 
            theme="twoTone" 
            type="delete"
            style={{ fontSize: '18px' }}
        />
    }

    updateKeyInput = e => {
        const { current } = this.state;
        this.setState({
            current: { ...current, key: e.target.value }
        });
    }
    
    updateValInput = e => {
        const { current } = this.state;
        this.setState({
            current: { ...current, val: e.target.value }
        });
    }

    toggleSensitive = () => {
        const { current } = this.state;
        this.setState({
            current: { ...current, sensitive: !current.sensitive }
        });
    }

    addEntry = () => {
        const { current, data } = this.state;
        const exist = data.some(v => current.key === v.key);
        if (exist) {
            window.alert('Key already exists')
            return;
        }
        if (current.val === '' || current.key === '') {
            window.alert('input cannot be empty')
            return;
        }
        this.setState({
            current: emptyCurrent,
            data: [...data, { ...current, enabled: true }],
        });
    }

    render() {
        const { data, current } = this.state;
        const { key: k, val: v, sensitive } = current; 
        return (
            <div>
                <Input.Group compact style={{ display: 'flex' }}>
                    <Input style={{ width: '20%' }} placeholder="key" onChange={this.updateKeyInput} value={k}/>
                    <Input placeholder="value" onChange={this.updateValInput} value={v}/>
                    <Radio.Group value={`${sensitive}`} buttonStyle="solid">
                        <Radio.Button onClick={this.toggleSensitive} value="true">Senstive</Radio.Button>
                    </Radio.Group>
                    <Button type="primary" icon="plus-square" onClick={this.addEntry}/>
                </Input.Group>
                <br/>

                <Table columns={columns} dataSource={data}/>
            </div>
        );
    }
}
export default UserInfo;