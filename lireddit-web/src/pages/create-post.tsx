import { Button, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react'
import InputField from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql';
import { CreateUrqlClient } from '../utils/createUrqlClient';
import Layout from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter()

    useIsAuth();
    const [, createPost] = useCreatePostMutation();
    return (
        <Layout variant="small">
            <Formik 
                initialValues={{title: "", text: ""}} 
                onSubmit={async (values) => {
                    const { error } = await createPost({input: values})
                    console.log(error)
                    if(!error){
                        router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name='title' placeholder='title' label='title'/>
                        <Box mt={4}>
                            <InputField textarea name='text' placeholder='text...' label="body" />
                        </Box>
                        <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting} mx="auto">Create Post</Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

export default withUrqlClient(CreateUrqlClient)(CreatePost);