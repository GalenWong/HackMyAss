import React from 'react';
import "antd/dist/antd.css";
import { Table, Input, Icon, Checkbox } from "antd";

const columns = [
    {
      width: 5,
      title: "URL",
      dataIndex: "URL",
      key: "URL",
      render: text => <a href="javascript:;">{text}</a>
    },
    {
        width: 5,
        title: "Enabled",
        dataIndex: "Enabled",
        key: "Enabled",
    },
    {
        width: 5,
        title: "Action",
        dataIndex: "",
        key: "x"
    }
  ];
  
  const tempData = [
    {
      key: "1",
      URL: "https://www.google.com",
      Enabled: true
    },
    {
      key: "2",
      URL: "https://www.espncricinfo.com",
      Enabled: true
    }
  ];

class WhiteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keynum: 3,
            data: [...tempData]
        }
        columns[1].render = this.boolRender(columns[1].key);
        columns[2].render = this.deleteRowRender;
    }

    boolRender = columnKey => {
        return(text,record) => {
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
                        eq = value === i.URL
                        if(eq)
                        {
                            window.alert("URL already exists!");
                            return;
                        }
                    }
                    if(! eq || this.state.data.length<1 || this.state.data === undefined) {
                        let added = {
                            key: String(this.state.keynum),
                            URL: value,
                            Enabled: true
                        }
                        let newState = {
                            keynum: this.state.keynum+1,
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