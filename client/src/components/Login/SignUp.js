import React, { useState } from 'react'
import './SignUp.css'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import * as yup from 'yup'
import { Formik, Form } from "formik";
import axios from 'axios'



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Web App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const formStatusProps = {
  success: {
    message: 'Signed up successfully.',
    type: 'success',
  },
  duplicate: {
    message: 'Email-id already exist. Please use different email-id.',
    type: 'error',
  },
  error: {
    message: 'Something went wrong. Please try again.',
    type: 'error',
  },
}

export default function Home() {
  const classes = useStyles()
  const [displayFormStatus, setDisplayFormStatus] = useState(false)
  const [formStatus, setFormStatus] = useState({
    message: '',
    type: '',
  })

  const createNewUser = async (data, resetForm) => {
    
      const apiUrl = `http://localhost:5000/signup`;
      axios.post(apiUrl, data).then((response) => {
        console.log(response)
        if(response) {
          setFormStatus(formStatusProps.success)
          resetForm({})
        }
        setDisplayFormStatus(true)
      }, (error) => {
        const response = error.response
        if (
          response.data === 'user already exist' &&
          response.status === 400
        ) {
          setFormStatus(formStatusProps.duplicate)
        } else {
          setFormStatus(formStatusProps.error)
        }
        setDisplayFormStatus(true)
      });      
  
    
  }
  let loginSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Enter valid email-id').required('Email is required'),
    password: yup.string().required('Password is required')
  })


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={(values, actions) => {
            createNewUser(values, actions.resetForm)
            setTimeout(() => {
              actions.setSubmitting(false)
            }, 500)
          }}>
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              isSubmitting
            } = props
            return (

              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.firstName && touched.firstName
                          ? errors.firstName
                          : 'Enter your first name.'
                      }
                      error={
                        errors.firstName && touched.firstName
                          ? true
                          : false
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.lastName && touched.lastName
                          ? errors.lastName
                          : 'Enter your last name.'
                      }
                      error={
                        errors.lastName && touched.lastName
                          ? true
                          : false
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.email && touched.email
                          ? errors.email
                          : 'Enter a valid email.'
                      }
                      error={
                        errors.email && touched.email
                          ? true
                          : false
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.password && touched.password
                          ? errors.password
                          : 'Enter a valid password.'
                      }
                      error={
                        errors.password && touched.password
                          ? true
                          : false
                      }
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  className={classes.submit}
                >
                  Sign Up
          </Button>
                {displayFormStatus && (
                  <div className="formStatus">
                    {formStatus.type === 'error' ? (
                      <p
                        className={
                          classes.errorMessage
                        }
                      >
                        {formStatus.message}
                      </p>
                    ) : formStatus.type ===
                      'success' ? (
                          <p
                            className={
                              classes.successMessage
                            }
                          >
                            {formStatus.message}
                          </p>
                        ) : null}
                  </div>
                )}
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link href="#" variant="body2">
                      Already have an account? Sign in
              </Link>
                  </Grid>
                </Grid>
              </Form>
            )
          }}
        </Formik>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}