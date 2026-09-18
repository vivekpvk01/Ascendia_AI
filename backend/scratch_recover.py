import json
import os

log_path = r'C:\Users\vivek\.gemini\antigravity-ide\brain\b37fbdde-9885-445b-8641-092a5f46be43\.system_generated\logs\transcript_full.jsonl'
targets = ['auth.py', 'practice.py', 'admin.py']
contents = {}

with open(log_path, encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data and data['tool_calls']:
                for call in data['tool_calls']:
                    if call['function']['name'] == 'default_api:write_to_file':
                        args = json.loads(call['function']['arguments'])
                        tf = args.get('TargetFile', '')
                        for t in targets:
                            if tf.endswith(r'routes\\' + t) or tf.endswith('routes/' + t):
                                contents[t] = args['CodeContent']
        except Exception:
            pass

for t, content in contents.items():
    with open(f'app/api/v1/routes/{t}', 'w', encoding='utf-8') as f:
        f.write(content.replace('.model_dump()', '.model_dump(mode="json")'))

print('Recovered:', list(contents.keys()))
