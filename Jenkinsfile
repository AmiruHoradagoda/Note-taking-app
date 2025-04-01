pipeline {
    agent any
    environment{
        // Docker-related environment variables
        DOCKER_IMAGE_BACKEND = "amiru1234/note-app-backend:latest"
        DOCKER_IMAGE_FRONTEND = "amiru1234/note-app-frontend:latest"
        DOCKER_CREDENTIALS_ID = "dockerhub-credentials"

        // Container names for deployment
        DOCKER_CONTAINER_BACKEND = 'noteapp-backend'
        DOCKER_CONTAINER_FRONTEND = 'noteapp-frontend'

        // SSH deployment variables
        SSH_CREDENTIALS_ID = "notekeep-prod-server"
        SSH_TARGET = "ubuntu@100.25.81.92"
    }

    tools {
        maven 'mvn-3.9.8'
        nodejs 'node-22.12.0'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/AmiruHoradagoda/Note-taking-app.git', credentialsId: 'amiruweb-jenkins-access-token'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend/NoteApp') {  
                    script {
                        withCredentials([usernamePassword(credentialsId: 'notekeep-prod-database-credentials', usernameVariable: 'MONGODB_USERNAME', passwordVariable: 'MONGODB_PASSWORD')]) {
                            sh '''#!/bin/bash
                            echo "Building backend with Mongodb database"
                            export MONGODB_USERNAME=$MONGODB_USERNAME
                            export MONGODB_PASSWORD=$MONGODB_PASSWORD
                            mvn clean package
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Backend Tests') {
            steps {
                dir('backend/NoteApp') {
                    sh 'mvn test'
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('frontend/note-app') {  
                    echo "Building frontend"
                    sh 'npm install --save-dev @babel/plugin-proposal-private-property-in-object'
                    sh 'npm install react-select' 
                    sh 'npm install'
                    sh 'CI=false npm run build'
                }
            }
        }
        stage('Docker Build and Push') {
            steps {
                dir('backend/NoteApp') {
                    script {
                        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh '''
                                docker build -t ${DOCKER_IMAGE_BACKEND} .
                                echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
                                docker push ${DOCKER_IMAGE_BACKEND}
                            '''
                        }
                    }
                }
                dir('frontend/note-app') {
                    script {
                        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh '''
                                docker build -t ${DOCKER_IMAGE_FRONTEND} .
                                echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
                                docker push ${DOCKER_IMAGE_FRONTEND}
                            '''
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: "${SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
                        sh """
                        ssh -i \${SSH_KEY} -o StrictHostKeyChecking=no ${SSH_TARGET} '
                        # Stop and remove existing containers
                        docker stop ${DOCKER_CONTAINER_BACKEND} || true
                        docker rm ${DOCKER_CONTAINER_BACKEND} || true
                        docker stop ${DOCKER_CONTAINER_FRONTEND} || true
                        docker rm ${DOCKER_CONTAINER_FRONTEND} || true
                        # Pull latest images
                        docker pull ${DOCKER_IMAGE_BACKEND}
                        docker pull ${DOCKER_IMAGE_FRONTEND}
                        # Start new containers
                        docker run -d --name ${DOCKER_CONTAINER_BACKEND} -p 8080:8080 ${DOCKER_IMAGE_BACKEND}
                        docker run -d --name ${DOCKER_CONTAINER_FRONTEND} -p 3000:3000 ${DOCKER_IMAGE_FRONTEND}
                        '
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}