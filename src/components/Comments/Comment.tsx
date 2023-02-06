import React, { useEffect, useState } from 'react';
import EntityDetails from '../EntityDetails/EntityDetails';
import { APIComment } from '../../typings/apiTypes';

type CommentProps = {
    comment: APIComment;
};
const Comment = ({ comment }: CommentProps): JSX.Element => {
    if (comment) {
        const name = comment.firstName + ' ' + comment.lastName;

        const date = new Date(comment.createdAt).toLocaleDateString('en-GB');
        return (
            <EntityDetails
                headerText={name}
                details={[date]}
                description={comment.text}
            ></EntityDetails>
        );
    } else {
        return <p></p>;
    }
};
export default Comment;
