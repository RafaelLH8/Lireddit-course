import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState< 'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
    const [, vote] = useVoteMutation();
    return (
        <Flex direction="column" alignItems='center' justifyContent='center' mr='4'>
            <IconButton 
            onClick={async () => {
                if(post.voteStatus === 1){
                    return;
                }
                setLoadingState('updoot-loading')
                vote({ postId: post.id, value: 1})
                setLoadingState('not-loading')
            }} aria-label="upvote" isLoading={loadingState === 'updoot-loading'} colorScheme={post.voteStatus === 1 ? "green" : undefined}>
                <ChevronUpIcon w="24px" h="24px"/>
            </IconButton>
            {post.points}
            <IconButton 
            onClick={async () => {
                if(post.voteStatus === -1){
                    return;
                }
                setLoadingState('downdoot-loading')
                vote({ postId: post.id, value: -1})
                setLoadingState('not-loading')
            }}  aria-label="downvote" isLoading={loadingState === 'downdoot-loading'} colorScheme={post.voteStatus === -1 ?"red" : undefined}>
                <ChevronDownIcon w="24px" h="24px" />
            </IconButton>
        </Flex>
    );
}