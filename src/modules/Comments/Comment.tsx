import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EntityDetails from '../../components/EntityDetails/EntityDetails';
import { APIComment } from '../../typings/apiTypes';
const Comments = styled.div`
    background: lightgrey;
    border: 1px;
`;
type CommentProps = {
    comment: APIComment;
};
const Comment = (props: CommentProps): JSX.Element => {
    if (props.comment) {
        return (
            <EntityDetails
                headerText={
                    props.comment.createdAt +
                    props.comment.firstName +
                    props.comment.lastName
                }
                isDetailsCard={true}
                description={props.comment.text}
            ></EntityDetails>
        );
    } else {
        return <p></p>;
    }
};
export default Comment;
