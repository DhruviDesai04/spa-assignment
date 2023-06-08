import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Tabs, Row, Col, Divider, Tree, Button, Space } from 'antd';
import { PlusOutlined, MinusOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';

import './index.css';

const x = 3;
const y = 2;
const z = 1;
const defaultData = [];

const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || 'Collection';
    const tns = _tns || defaultData;

    const children = [];
    for (let i = 1; i <= x; i++) {
        const key = `${preKey}.${i}`;
        tns.push({ title: key, key, children: [] });
        if (i <= y) {
            children.push(key);
        }
    }
    if (_level < 0) {
        return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
        tns[index].children = [];
        return generateData(level, key, tns[index].children);
    });
};
generateData(z);

const onChange = (key) => {
    console.log(key);
};

const items = [
    {
        key: '1',
        label: `All`,
        children: `Content of Tab All`,
    },
    {
        key: '2',
        label: `Board`,
        children: `Content of Tab Board`,
    },
    {
        key: '3',
        label: `Graph`,
        children: `Content of Tab Graph`,
    },
    {
        key: '4',
        label: `Recent`,
        children: `Content of Tab Recent`,
    },
];

const Items = () => {
    const [gData, setGData] = useState(defaultData);
    const [expandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0']);
    const [selectedNode, setSelectedNode] = useState(null);
    const [editNodeKey, setEditNodeKey] = useState(null);
    const [editNodeName, setEditNodeName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        // Load data from local storage
        const dataFromStorage = localStorage.getItem('gData');
        if (dataFromStorage) {
            setGData(JSON.parse(dataFromStorage));
        }
    }, []);

    useEffect(() => {
        // Save data to local storage whenever gData changes
        localStorage.setItem('gData', JSON.stringify(gData));
    }, [gData]);

    const onDragEnter = (info) => {
        console.log(info);
    };

    const onDrop = (info) => {
        console.log(info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (
            data,
            key,
            callback,
        ) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };
        const data = [...gData];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 &&
            info.node.props.expanded &&
            dropPosition === 1
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let ar = [];
            let i;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
        setGData(data);
    };

    const handleAddRoot = () => {
        const newNodeKey = `Collection.${gData.length + 1}`;
        const newNode = { title: newNodeKey, key: newNodeKey, children: [] };
        setGData([...gData, newNode]);
    };

    const handleNodeClick = (node) => {
        if (!node.children) {
            setSelectedNode(node);
        }

        // Enable editing mode and set initial content
        setEditMode(true);
        setEditedContent(node.children);
    };

    const handleSave = () => {
        // Save the edited content
        setSelectedNode((prevNode) => ({
            ...prevNode,
            children: editedContent
        }));

        // Disable editing mode
        setEditMode(false);
    };

    const renderTitle = (node) => {
        const handleAddChild = () => {
            if (!node.children) {
                node.children = [];
            }
            const lastChildIndex = node.children.length + 1;
            const newNodeKey = `${node.key}.${lastChildIndex}`;
            const newNode = { title: newNodeKey, key: newNodeKey, children: [] };
            node.children.push(newNode);
            setGData([...gData]);
        };

        const handleRemoveNode = () => {
            const loop = (data, key, callback) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].key === key) {
                        return callback(data, i);
                    }
                    if (data[i].children) {
                        loop(data[i].children, key, callback);
                    }
                }
            };

            loop(gData, node.key, (parent, index) => {
                parent.splice(index, 1);
            });

            setGData([...gData]);
        };

        const handleEditNode = () => {
            setEditNodeKey(node.key);
            setEditNodeName(node.title);
        };
        const handleSaveNode = () => {
            const loop = (data, key, callback) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].key === key) {
                        return callback(data[i], i);
                    }
                    if (data[i].children) {
                        loop(data[i].children, key, callback);
                    }
                }
            };

            loop(gData, editNodeKey, (item) => {
                item.title = editNodeName;
            });

            setGData([...gData]);
            setEditNodeKey(null);
            setEditNodeName('');
        };

        const isActive = selectedNode && selectedNode.key && selectedNode.key === node.key;
        const isLeaf = !node.children || node.children.length === 0; // Check if the node is a leaf node

        return (
            <Space>
                {editNodeKey === node.key ? (
                    <>
                        <input
                            type="text"
                            value={editNodeName}
                            onChange={(e) => setEditNodeName(e.target.value)}
                        />
                        <Button
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={handleSaveNode}
                        />
                    </>
                ) : (
                    <>
                        <span
                            className={isActive ? 'active-node' : ''}
                            onClick={isLeaf ? () => handleNodeClick(node) : null} // Add click action only for leaf nodes
                        >
                            {node.title}
                        </span>
                        <div>
                            <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={handleAddChild}
                            />
                            <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={handleRemoveNode}
                            />
                            <Button
                                icon={<EditOutlined />}
                                size="small"
                                onClick={handleEditNode}
                            />
                        </div>
                    </>
                )}
            </Space>
        );
    };

    return (
        <div className="nav-tabs">
            <Row>
                <Col span={24}>
                    <Tabs className="nav-top-tabs" defaultActiveKey="1" onChange={onChange}>
                        {items.map(item => (
                            <Tabs.TabPane key={item.key} tab={item.label}>
                                {item.key === '1' && (
                                    <Row>
                                        <Col className="d-flex-column items-tree" span={24} md={8} lg={6}>
                                            <Button
                                                className="add-collection-btn"
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={handleAddRoot}
                                            >
                                                New Collection
                                            </Button>
                                            <Tree
                                                className="draggable-tree"
                                                defaultExpandedKeys={expandedKeys}
                                                draggable
                                                blockNode
                                                onDragEnter={onDragEnter}
                                                onDrop={onDrop}
                                                treeData={gData}
                                                titleRender={renderTitle}
                                            />
                                        </Col>
                                        <Col span={24} md={16} lg={18}>
                                            {editMode ? (
                                                <div>
                                                    <ReactQuill
                                                        value={editedContent}
                                                        onChange={setEditedContent}
                                                        modules={{
                                                            toolbar: [
                                                                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                                [{ list: 'ordered' }, { list: 'bullet' }],
                                                                ['link', 'image'],
                                                                ['clean'],
                                                            ],
                                                        }}
                                                    />
                                                    <Button onClick={handleSave}>Save</Button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p style={{ padding: "20px" }}>Select node to add Content</p>
                                                </div>
                                            )}

                                        </Col>
                                    </Row>
                                )}
                                {item.key !== '1' && item.children}
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
};

export default Items;
