#version 300 es

uniform vec3 u_translation; // translation vector

layout (location = 0) in vec3 pos;
layout (location = 1) in vec3 color;

out vec3 vert_color;

void main()
{
    vert_color = color;
    gl_Position = vec4(pos + u_translation, 1.0);
}