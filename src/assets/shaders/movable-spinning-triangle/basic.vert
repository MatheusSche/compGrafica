#version 300 es

uniform float u_aspectRatio;
uniform mat3 u_model;

layout (location = 0) in vec3 pos;
layout (location = 1) in vec3 color;

out vec3 vert_color;

void main()
{
    vec3 position = u_model * pos;
    
    vert_color = color;
    gl_Position = vec4(position.x/u_aspectRatio, position.y, 0, 1.0);
}