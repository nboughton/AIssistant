# AIssistant

To get started ensure you have docker and docker-compose set up. Then run the setup script to create the necessary storage volumes for Ollama and Mimic3.

To tweak the voice output of Mimic3 you can adjust the command parameter in the mimic service using the guidance for voices here: https://mycroftai.github.io/mimic3-voices/

Once all that is ready you can start the service by running ```docker-compose up``` and pointing your web browser at ```localhost:8000```.
