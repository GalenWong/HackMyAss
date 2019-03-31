
/* global chrome */
import React from 'react';
import "antd/dist/antd.css";
import { Table, Input, Icon, Checkbox } from "antd";
import {isEqual} from 'lodash';

const columns = [
    {
      width: 5,
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: text => <a href="javascript:;">{text}</a>
    },
    {
        width: 5,
        title: "Enabled",
        dataIndex: "enabled",
        key: "enabled",
    },
    {
        width: 5,
        title: "Action",
        dataIndex: "",
        key: "x"
    }
  ];
  
  /*const tempData = [
    {
      url: "https://www.google.com",
      enabled: true
    },
    {
      url: "https://www.espncricinfo.com",
      enabled: true
    }
  ];*/

class WhiteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        columns[1].render = this.boolRender(columns[1].key);
        columns[2].render = this.deleteRowRender;
        try {
            chrome.storage.sync.get(['whitelist'], (result) => {
                if (result['whitelist'] instanceof Array) {
                    this.setState({
                        data: [...result['whitelist']],
                    });
                }
            })
        } catch (e) {
            console.log('failed fetch');
            console.error(e);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { data } = this.state;
        console.log('data', data);
        console.log('prev data', prevState.data);
        if (! isEqual(prevState.data, data)) {
            try {
                chrome.storage.sync.set({ whitelist: data }, () => {
                    console.log('updates', data);
                });
            } catch (e) {
                console.log('failed');
                console.error(e);
            }
        }
    }

    boolRender = columnKey => {
        return(text,record) => {
            const updateBool = (e) => {
                const { data } = this.state;
                const newdata = data.map(v => {
                    if (v.url === record.url) {
                        const r = {...v};
                        r[columnKey] = e.target.checked;
                        return r; 
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
            const newdata = data.filter(v => v.url !== record.url);
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

    render() {
        var eq = false;
        console.log(this.state.data);
        return[
            <Input.Search placeholder="New website to whitelist" enterButton={<Icon type="plus" />} size="large" onSearch={value => {
                if(! typeof(value) === "string" || ! value instanceof String || value === '') {
                    window.alert("Entry cannot be empty")
                    return;
                }
                else {
                    for(let i of this.state.data) {
                        eq = value === i.url
                        if(eq)
                        {
                            window.alert("URL already exists!");
                            return;
                        }
                    }
                    if(! eq || this.state.data.length<1 || this.state.data === undefined) {
                        let added = {
                            url: value,
                            enabled: true
                        }
                        let newState = {
                            data: [...this.state.data,added],
                        }
                        this.setState(newState);
                    }
                }
                this.forceUpdate();
            }}/>,
            <Table
                columns={columns}
                dataSource={this.state.data}
                pagination={false}
            />
        ];
    }
}

export default WhiteList;