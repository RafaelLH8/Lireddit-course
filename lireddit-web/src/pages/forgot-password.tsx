import { Button, Box } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import { CreateUrqlClient } from '../utils/createUrqlClient'
import React, { useState } from 'react'
import InputField from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()
    return (
        <Wrapper variant='small'>
            <Formik 
                initialValues={{email: ''}} 
                onSubmit={async (values) => {
                    await forgotPassword(values)
                    setComplete(true)
                }}
            >
                {({ isSubmitting }) => complete ? <Box>We sent you an email</Box> : (
                    <Form>
                        <InputField name='email' placeholder='email' label='email' type="email" />
                        <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting} mx="auto">Forgot password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(CreateUrqlClient)(ForgotPassword);