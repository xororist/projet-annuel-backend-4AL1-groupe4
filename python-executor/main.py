import sys
import tarfile
from io import BytesIO
import docker
import os

DOCKER_HOST = os.environ["DOCKER_HOST"] = "unix:///home/hugo/.docker/desktop/docker.sock"
client = docker.from_env()

try:
    print("Script name:" + sys.argv[1])
    python_script_name = sys.argv[1]
    python_script_path = f'./sample/{python_script_name}'
    print("Script path:" + python_script_path)
except IndexError as e:
    print("[ERROR] Script name not specified")
    sys.exit(0)


dockerfile_content = f'''
FROM python:3.11-slim-bookworm
WORKDIR /app
COPY {python_script_name} /app/{python_script_name}
CMD ["python", "/app/{python_script_name}"]
'''

context = BytesIO()
with tarfile.open(fileobj=context, mode='w') as tar:
    dockerfile = BytesIO(dockerfile_content.encode('utf-8'))
    tarinfo = tarfile.TarInfo('Dockerfile')
    tarinfo.size = len(dockerfile.getvalue())
    tar.addfile(tarinfo, dockerfile)

    with open(python_script_path, 'rb') as f:
        content = f.read()
        info = tarfile.TarInfo(name=python_script_name)
        info.size = len(content)
        tar.addfile(tarinfo=info, fileobj=BytesIO(content))

context.seek(0)

cli = docker.APIClient(base_url=DOCKER_HOST)
response = cli.build(fileobj=context, custom_context=True, encoding='gzip',
                     tag='python-executor:latest', rm=True, decode=True)

for line in response:
    if 'error' in line:
        print("Error:", line['errorDetail']['message'])
    else:
        print(line.get('stream', ''))


container = client.containers.run("python-executor:latest", detach=True, )
print('Container: ' + container.id)

try:
    container.wait()
    logs = container.logs()
    print(logs.decode('utf-8'))
finally:
    container.remove()


