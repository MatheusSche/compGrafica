#version 300 es

uniform float u_aspectRatio;
uniform float u_angle;

layout (location = 0) in vec3 pos;
layout (location = 1) in vec3 color;

out vec3 vert_color;

mat3 rotation2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

void main()
{
    vec3 position = rotation2D(u_angle) * pos;

    vert_color = color;    
    gl_Position = vec4(position.x / u_aspectRatio, position.y, position.z, 1.0);
}