pipeline {
    agent any

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