import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import contents from './contents';
import './index.css';
import { ListItem } from '../../components/list_item';
// import file from "./pages/introduction.md";
import ReactMarkdown from 'react-markdown'

export const Docs = () => {

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const [selectedMarkdown, setSelectedMarkdown] = useState(undefined);

    useEffect( async () => {
        if(!contents[selectedItemIndex].hasOwnProperty('markdown')){
            const markdown = await getMarkdown(selectedItemIndex);
            contents[selectedItemIndex]['markdown'] = markdown;
        }
        setSelectedMarkdown(contents[selectedItemIndex]['markdown']);
    }, [selectedItemIndex]);

    const getMarkdown = async (index) => {
        const file = require(`./markdown/${contents[index].path}`);
        const res = await fetch(file.default);
        return res.text();
    }

    const makeListItems = () => {
        return(
            <ul> 
                {
                    contents.map((content, index) => {
                        return <ListItem key={index} onClick={() => setSelectedItemIndex(index)} text={content.name} />
                    })
                }
            </ul>
        );
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className='sidebar' md={2}>
                        <div className='sidebar-sticky'>
                            { makeListItems() }
                        </div>
                        
                    </Col>
                    <Col md={8}>
                        {selectedItemIndex == null ? '' : <ReactMarkdown source={selectedMarkdown} /> }
                    </Col>
                </Row>
            </Container>
        </>
    );

}


