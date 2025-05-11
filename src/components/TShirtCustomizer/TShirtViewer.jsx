import { useState, useEffect, useRef } from "react";

export default function TShirtViewer({
  color,
  customImage,
  text,
  showThreeDModel,
  dimensions,
}) {
  const [loading3D, setLoading3D] = useState(false);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const shirtModelRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize Three.js scene when component mounts
  useEffect(() => {
    // Only load Three.js scripts when needed
    if (showThreeDModel) {
      loadThreeJsScripts()
        .then(() => {
          initThreeJs();
          setLoading3D(false);
        })
        .catch((error) => {
          console.error("Error loading Three.js:", error);
          setLoading3D(false);
        });
    }

    return () => {
      // Clean up Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();

        if (canvasRef.current?.parentElement) {
          canvasRef.current.parentElement.removeChild(canvasRef.current);
        }

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };
  }, [showThreeDModel]);

  // Update shirt color when it changes
  useEffect(() => {
    if (shirtModelRef.current && showThreeDModel) {
      shirtModelRef.current.material.color.set(color);
    }
  }, [color, showThreeDModel]);

  // Update shirt texture when custom image changes
  useEffect(() => {
    if (
      shirtModelRef.current &&
      customImage &&
      showThreeDModel &&
      window.THREE
    ) {
      const texture = new window.THREE.TextureLoader().load(customImage);
      shirtModelRef.current.material.map = texture;
      shirtModelRef.current.material.needsUpdate = true;
    }
  }, [customImage, showThreeDModel]);

  // Load Three.js scripts dynamically
  const loadThreeJsScripts = () => {
    setLoading3D(true);

    return new Promise((resolve, reject) => {
      if (window.THREE) {
        resolve();
        return;
      }

      const threeScript = document.createElement("script");
      threeScript.src =
        "https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js";
      threeScript.async = true;
      threeScript.onload = () => {
        const orbitControlsScript = document.createElement("script");
        orbitControlsScript.src =
          "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js";
        orbitControlsScript.async = true;
        orbitControlsScript.onload = () => {
          const gltfLoaderScript = document.createElement("script");
          gltfLoaderScript.src =
            "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js";
          gltfLoaderScript.async = true;
          gltfLoaderScript.onload = resolve;
          gltfLoaderScript.onerror = reject;
          document.body.appendChild(gltfLoaderScript);
        };
        orbitControlsScript.onerror = reject;
        document.body.appendChild(orbitControlsScript);
      };
      threeScript.onerror = reject;
      document.body.appendChild(threeScript);
    });
  };

  // Initialize Three.js scene
  const initThreeJs = () => {
    if (!window.THREE) return;

    const THREE = window.THREE;
    const container = document.getElementById("threed-container");
    if (!container) return;

    // Clear previous canvas if exists
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf3f4f6);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // Create a simple t-shirt model if GLTF loading fails
    // This is a fallback
    createSimpleTShirt();

    // Attempt to load the real t-shirt model
    if (window.THREE.GLTFLoader) {
      const loader = new THREE.GLTFLoader();
      loader.load(
        "/models/shirt_baked.glb",
        (gltf) => {
          scene.remove(shirtModelRef.current); // Remove placeholder

          const model = gltf.scene;
          scene.add(model);

          // Find the shirt mesh in the loaded model
          model.traverse((object) => {
            if (object.isMesh) {
              object.material.color.set(color);
              if (customImage) {
                const texture = new THREE.TextureLoader().load(customImage);
                object.material.map = texture;
                object.material.needsUpdate = true;
              }
              shirtModelRef.current = object;
            }
          });
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
        }
      );
    }

    // Controls
    if (window.THREE.OrbitControls) {
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 1.5;
      controls.maxDistance = 5;
    }

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Rotate the shirt slightly
      if (shirtModelRef.current) {
        shirtModelRef.current.rotation.y += 0.003;
      }

      // Update controls if they exist
      if (window.THREE.OrbitControls) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
  };

  // Create a simple t-shirt shape as a placeholder
  const createSimpleTShirt = () => {
    if (!window.THREE || !sceneRef.current) return;

    const THREE = window.THREE;
    const scene = sceneRef.current;

    // Create a simple t-shirt using basic shapes
    // Main body
    const bodyGeometry = new THREE.CylinderGeometry(1, 0.8, 2, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: color,
      side: THREE.DoubleSide,
    });

    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1, 1, 0.5);
    scene.add(body);

    // Left sleeve
    const sleeveGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.7, 16);
    const leftSleeve = new THREE.Mesh(sleeveGeometry, bodyMaterial);
    leftSleeve.position.set(-1, 0.3, 0);
    leftSleeve.rotation.z = Math.PI / 4;
    scene.add(leftSleeve);

    // Right sleeve
    const rightSleeve = new THREE.Mesh(sleeveGeometry, bodyMaterial);
    rightSleeve.position.set(1, 0.3, 0);
    rightSleeve.rotation.z = -Math.PI / 4;
    scene.add(rightSleeve);

    // Collar
    const collarGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const collar = new THREE.Mesh(collarGeometry, bodyMaterial);
    collar.position.set(0, 0.8, 0);
    collar.rotation.x = Math.PI / 2;
    scene.add(collar);

    // Group all parts
    const tshirtGroup = new THREE.Group();
    tshirtGroup.add(body, leftSleeve, rightSleeve, collar);

    // Apply custom image as texture if available
    if (customImage) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(customImage, (texture) => {
        bodyMaterial.map = texture;
        bodyMaterial.needsUpdate = true;
      });
    }

    shirtModelRef.current = tshirtGroup;
  };

  function render2DTShirt() {
    return (
      <div className="t-shirt-preview">
        <div className="t-shirt-base-container">
          {/* T-shirt base image */}
          <div className="t-shirt-base" style={{ backgroundColor: color }}>
            {/* Neck area */}
            <div className="t-shirt-neck"></div>

            {/* Sleeves */}
            <div
              className="t-shirt-sleeve-left"
              style={{ backgroundColor: color }}
            ></div>
            <div
              className="t-shirt-sleeve-right"
              style={{ backgroundColor: color }}
            ></div>

            {/* Custom image on t-shirt */}
            {customImage && (
              <div className="t-shirt-image">
                <img src={customImage} alt="Custom design" />
              </div>
            )}

            {/* Custom text on t-shirt */}
            {text && (
              <div className="t-shirt-text">
                <div
                  className="t-shirt-text-container"
                  style={{ color: color === "white" ? "#333" : "white" }}
                >
                  {text.split("\n").map((line, i) => (
                    <div
                      key={i}
                      className="t-shirt-text-line"
                      style={{
                        textShadow:
                          color === "white"
                            ? "none"
                            : "1px 1px 1px rgba(0,0,0,0.5)",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size info overlay */}
            <div className="size-info">
              {dimensions.height}cm / {dimensions.weight}kg / {dimensions.build}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function render3DTShirt() {
    if (loading3D) {
      return (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading 3D Model...</p>
        </div>
      );
    }

    return (
      <div id="threed-container" className="threed-viewer">
        {/* Three.js will render the 3D model here */}
      </div>
    );
  }

  return (
    <div className="t-shirt-viewer">
      <div className="viewer-container">
        <div className="viewer-header">
          <h2 className="viewer-title">Preview</h2>
          <div className="toggle-hint">
            <span className="kbd">Alt + Q</span> to toggle 3D
          </div>
        </div>

        {showThreeDModel ? render3DTShirt() : render2DTShirt()}
      </div>
    </div>
  );
}
