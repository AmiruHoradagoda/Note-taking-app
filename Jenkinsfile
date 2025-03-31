pipeline {
    agent any
    tools {
        maven 'mvn-3.9.8'
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello, World!'
                 echo 'Test1'
            }
        }
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/AmiruHoradagoda/Note-taking-app.git', credentialsId: 'amiruweb-jenkins-access-token'
            }
        }
    }
}
