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
                            echo "MongoDB Username: $MONGODB_USERNAME"
                            echo "MongoDB Password: $MONGODB_PASSWORD"
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
                    sh 'REACT_APP_API_URL=https://app.amiru-web.xyz/api/v1 CI=false npm run build'
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
        
        stage('Ansible Deploy') {
            steps {
                script {
                    withCredentials([
                        usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", 
                                    usernameVariable: 'DOCKER_USERNAME', 
                                    passwordVariable: 'DOCKER_PASSWORD'),
                        sshUserPrivateKey(credentialsId: "${SSH_CREDENTIALS_ID}", 
                                    keyFileVariable: 'SSH_KEY')
                    ]){
                        sh '''
                            # Use the correct path to the Ansible files
                            cd Ansible
                            
                            # Create a temporary inventory file with correct values
                            echo "[ec2]" > temp_inventory.ini
                            echo "dev-server ansible_host=ec2-100-25-81-92.compute-1.amazonaws.com" >> temp_inventory.ini
                            echo "" >> temp_inventory.ini
                            echo "[ec2:vars]" >> temp_inventory.ini
                            echo "ansible_user=ubuntu" >> temp_inventory.ini
                            echo "ansible_ssh_common_args='-o StrictHostKeyChecking=no'" >> temp_inventory.ini
                            
                            # Run ansible-playbook with the temporary inventory
                            ansible-playbook -i temp_inventory.ini --private-key $SSH_KEY playbook.yml
                            
                            # Clean up
                            rm temp_inventory.ini
                        '''
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