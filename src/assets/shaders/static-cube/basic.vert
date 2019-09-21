#version 300 es

layout (location = 0) in vec3 pos;
layout (location = 1) in vec3 color;

out vec4 vert_color;

void main()
{
    vert_color = color;
    gl_Position = vec4(pos.x, pos.y, pos.z, 1.0);
}